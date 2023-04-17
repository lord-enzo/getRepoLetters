import inquirer from 'inquirer'
import getLettersInFile from './getLettersInFile.mjs'

inquirer.prompt([
    {
        name: 'token',
        message: 'Hello stranger... I need a Github token to show you the world 😏',
        default: process.env.GITHUB_TOKEN
    }
]).then(async answer => {
    await getLettersInFile(answer.token)
})
