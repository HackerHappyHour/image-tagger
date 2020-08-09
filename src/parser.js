const s = require('semver')
const github = require('@actions/github')

const delimiter = '%'
const replacers = {
  major: 'x',
  minor: 'y',
  patch: 'z'
}

const errorInvalidTag = {error: 'value is not valid or cannot be coerced'}

const matcher = /%(?<major>x?)\.?(?<minor>y?)\.?(?<patch>z?)%/ig

exports.parseTag = (strategy, tag) => {
  if (strategy === 'latest') return 'latest'

  let matches = strategy.matchAll(matcher)

  try {
    // if 'tag' is valid, attempt to parse it
    // otherwise error: value is not valid or cannot be coerced
    var parsedTag = s.parse(tag, {includePrerelease: true})
    if (!parsedTag){
      parsedTag = s.parse(s.valid(s.coerce(tag)))
      if (!parsedTag) throw errorInvalidTag.error
    } 

    // parse away!
    // find X/Y/Z between %%'s or if only alpha's in string are X/Y/Z
    return {strategy_tag: 'latest'}

  } catch (error) {
    return {error: error}
  }

}

exports.replacers = replacers
exports.errorInvalidTag = errorInvalidTag
