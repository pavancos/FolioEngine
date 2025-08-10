import { Router, json, Request, Response } from 'express'
import authCheck from '../middlewares/authCheck.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import CraftBench from '../models/CraftBench.js'
import User from '../models/User.js'
import { templates } from '../folios/index.js'
import { Octokit } from 'octokit'
import {
  commitFolioToGithub,
  createGithubRepo,
  publishFolioToGithub
} from '../utils/github.js'

const craftBench = Router()
craftBench.use(json())
craftBench.use(asyncHandler(authCheck))

craftBench.post(
  '/new',
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const { folioConfig, meta } = req.body
      if (!folioConfig || !meta) {
        return res
          .status(400)
          .json({ error: true, message: 'Invalid request body' })
      }

      const newCraftBench = await CraftBench.create({
        craftName: meta.craftName,
        currentConfig: folioConfig,
        userCreated: req.user?.dbData._id,
        repoLink: '',
        folioSelected: meta?.folioId
      })

      if (!newCraftBench) {
        return res
          .status(500)
          .json({ error: true, message: 'Failed to create CraftBench' })
      }

      const updatedUser = await User.findByIdAndUpdate(
        {
          _id: req.user?.dbData._id
        },
        {
          $push: {
            craftBenches: newCraftBench._id
          },
          recentConfig: folioConfig
        },
        { new: true }
      )

      if (!updatedUser) {
        return res
          .status(500)
          .json({ error: true, message: 'Failed to update user' })
      }
      return res.status(201).json({
        error: false,
        message: 'CraftBench created successfully',
        craftId: newCraftBench._id.toString()
      })
    } catch (err: any) {
      res.status(500).json({
        error: true,
        message: 'Server Error',
        errorMessage: err && err.message ? err.message : String(err)
      })
    }
  })
)

craftBench.get(
  '/download/:craftId',
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const craftId = req.params.craftId as string
      // console.log('craftId: ', craftId);

      if (!craftId) {
        return res.status(400).json({ error: true, message: 'Invalid craftId' })
      }

      const cb = await CraftBench.findOne({ _id: craftId }).populate({
        path: 'folioSelected',
        select: 'folioName',
        model: 'Folio'
      })
      // console.log('cb: ', cb);

      if (!cb) {
        return res
          .status(404)
          .json({ error: true, message: 'CraftBench not found' })
      }
      const folio = cb.folioSelected as { folioName?: string }

      if (!folio || !folio.folioName) {
        return res.status(404).json({ error: true, message: 'Folio not found' })
      }
      const template = templates[folio.folioName]
      const generatedHTML = template ? template(cb.currentConfig) : ''
      return res.status(200).send(generatedHTML)
    } catch (err: any) {
      res.status(500).json({
        error: true,
        message: 'Server Error',
        errorMessage: err && err.message ? err.message : String(err)
      })
    }
  })
)

craftBench.post(
  '/publish/:craftId',
  asyncHandler(async (req: Request, res: Response) => {
    const { repoName } = req.body

    // Get CraftName
    // Get HTMLContent

    
    if (req.user === undefined || !req.user.accessToken) {
      return res.status(401).json({ error: true, message: 'Unauthorized' })
    }
    const accessToken = req.user.accessToken

    const octokit = new Octokit({
      auth: accessToken
    })


    try {
      const repoResponse = await createGithubRepo(octokit, repoName);
      
      const commitResponse = await commitFolioToGithub(
        octokit,
        repoName,
        repoResponse,
        'Hello'
      )

      const publishResponse = await publishFolioToGithub(
        octokit,
        repoName,
        repoResponse
      )

      // to do change status in DB

      res.json({
        success: true,
        message:
          'Successfully Published your Folio',
        folioUrl: publishResponse
      })
    } catch (error: any) {
      console.error(
        'Error creating repository, README.md, or preview branch:',
        error
      )

      // Handle GitHub API error responses
      if (error.response) {
        return res.status(error.response.status).json({
          error: error.response.data.message || 'Error from GitHub API'
        })
      }

      return res.status(500).json({ error: 'Internal Server Error' })
    }
  })
)

export default craftBench
