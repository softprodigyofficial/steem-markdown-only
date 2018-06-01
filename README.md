This is just a repackaging of the markdown parsing functionality for Busy.org. The repo can be found [here](https://github.com/busyorg/busy), which is based off of the code for [Steem Condenser](https://github.com/steemit/condenser).

I took base from [here](https://github.com/jeffbernst/steem-markdown) and compiled the js files using babel + removed dependency of less files which makes it to use only as mardown parser without css incase you wish to apply your own

All code in the `busy` folder is under the original license from Busy (see `BUSY_LICENSE.md` in the folder for more information).
<br>
Git repo: https://github.com/softprodigyofficial/steem-markdown-only/
<br><br>

## Installation

`npm install steem-markdown-only`

## Usage

`const steemMarkdown = require('steem-markdown-only')`

`const parsedMarkdown = steemMarkdown(markdown)`
