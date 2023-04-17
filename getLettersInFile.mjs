import { Octokit } from '@octokit/rest'

export default async function getLettersInFile(token) {
    const octokit = new Octokit({
            auth: token
        }),
        letters = new Map(),
        user = await octokit.request('GET /user'),
        countLettersInFile = async (repo, path) => {
            const response = await octokit.repos.getContent({
                owner: 'lodash',
                repo,
                path
            })

            if (Array.isArray(response.data)) {
                for (const item of response.data) {
                    await countLettersInFile(repo, item.path)
                }
            } else if (/\.js$|\.ts$/.test(response.data.name)){
                const content = Buffer.from(response.data.content, 'base64').toString()
                const lines = content.split('\n')
                for (const line of lines) {
                    const chars = line.split('')
                    for (const char of chars) {
                        if (/^[a-zA-Z]$/.test(char)) {
                            const count = letters.get(char.toLowerCase()) || 0
                            letters.set(char.toLowerCase(), count + 1)
                        }
                    }
                }
                console.log(`FILE: ${ response.data.name} - ✅`)
            }
        };

    console.log(`Nice to see you, ${ user.data.login } 👋! Welcome to this little application. Sit tight, it might take a while... 🙇‍️`)

    await countLettersInFile('lodash', '')

    const sortedLetters = [...letters.entries()].sort((a, b) => b[1] - a[1])

    console.log('🎉Hooray!! Here you have the results!')

    console.table(sortedLetters)
}