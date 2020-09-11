const s = require('semver')
const core = require('@actions/core')
const {getIdentifier} = require('./utils')
const {invalidTag, tooManyPatterns} = require('./errors')

const matcher = /(%(?<strategy>(?<major>x?)\.?(?<minor>y?)\.?(?<patch>z?))%)(?<variant>.*)/ig
const latest = /^latest*/

exports.parseTag = (pattern, tag) => {
  // if pattern starts with 'latest' return entire pattern
  if (latest.test(pattern)) return {tag: pattern}
  if (pattern.indexOf('%') > 2) return {error: tooManyPatterns}

  let Tag = {}
  let matches = pattern.matchAll(matcher)

    // if 'tag' is valid, attempt to parse it
  // otherwise error: value is not valid or cannot be coerced
  var parsedTag = s.parse(tag, {includePrerelease: true})
  if (!parsedTag){
    parsedTag = s.parse(s.valid(s.coerce(tag)))
    if (!parsedTag) return {error: invalidTag}
  } 

  const {major, minor, patch} = parsedTag
  const identifier = getIdentifier(parsedTag.prerelease, parsedTag.raw) 

  for(let match of matches){
    const {major: maj, minor:min, patch:fix, strategy, variant} = match.groups
    Tag = {...Tag, strategy, variant, identifier, maj, min, fix, major, minor, patch}

    let output = strategy
    if(maj){output = output.replace(/x/ig, major)}
    if(min){output = output.replace(/y/ig, minor)}
    if(fix){output = output.replace(/z/ig, patch)}
    if(identifier){output = `${output}${identifier}`}
    if(variant){output = `${output}${variant}`}
    Tag.tag = output
  }
  if(core.isDebug()){
    core.debug(JSON.stringify(Tag))  
  }
  return Tag
}
