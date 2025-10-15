# Publishing Guide

This guide explains how to publish the Novitus SDK to npm.

## Prerequisites

1. **npm Account**: Create an account at [npmjs.com](https://www.npmjs.com/)
2. **npm Login**: Run `npm login` to authenticate
3. **Organization**: If using `@novitus` scope, ensure you have access to the organization

## Pre-publish Checklist

Before publishing, ensure:

- [ ] All tests pass
- [ ] Code is linted: `npm run lint`
- [ ] TypeScript compiles: `npm run build`
- [ ] Version is updated in `package.json`
- [ ] `CHANGELOG.md` is updated
- [ ] `README.md` is up to date
- [ ] Examples work correctly
- [ ] No sensitive data in code

## Publishing Steps

### 1. Update Version

Follow [Semantic Versioning](https://semver.org/):

```bash
# Patch release (bug fixes)
npm version patch

# Minor release (new features, backward compatible)
npm version minor

# Major release (breaking changes)
npm version major
```

### 2. Update Changelog

Update `CHANGELOG.md` with:
- Version number and date
- List of changes (Added, Changed, Fixed, Removed)
- Breaking changes (if any)

### 3. Build and Test

```bash
# Clean and rebuild
npm run clean
npm install
npm run build

# Verify build output
ls -la dist/

# Test examples
npx ts-node examples/basic-receipt.ts
```

### 4. Publish to npm

```bash
# Dry run (test without publishing)
npm publish --dry-run

# Publish to npm
npm publish

# For scoped packages (first time)
npm publish --access public
```

### 5. Create Git Tag

```bash
git add .
git commit -m "Release v1.0.0"
git tag v1.0.0
git push origin main --tags
```

### 6. Create GitHub Release

1. Go to GitHub repository
2. Click "Releases" → "Create a new release"
3. Select the tag you created
4. Add release notes from CHANGELOG
5. Publish release

## Version Guidelines

### Patch Release (1.0.x)

- Bug fixes
- Performance improvements
- Documentation updates
- No API changes

```bash
npm version patch
```

### Minor Release (1.x.0)

- New features (backward compatible)
- New API methods
- Deprecations (with warnings)

```bash
npm version minor
```

### Major Release (x.0.0)

- Breaking changes
- API removals
- Major refactoring

```bash
npm version major
```

## Beta/RC Releases

For pre-releases:

```bash
# Beta release
npm version 1.1.0-beta.0
npm publish --tag beta

# Release candidate
npm version 1.1.0-rc.0
npm publish --tag rc
```

Install pre-release:
```bash
npm install @novitus/sdk@beta
npm install @novitus/sdk@rc
```

## CI/CD Publishing

For automated publishing with GitHub Actions:

1. Add `NPM_TOKEN` to GitHub Secrets:
   - Go to npm → Account → Access Tokens
   - Create "Automation" token
   - Add to GitHub: Settings → Secrets → New secret
   - Name: `NPM_TOKEN`

2. Push a version tag:
```bash
git tag v1.0.0
git push origin v1.0.0
```

The CI workflow will automatically publish to npm.

## Unpublishing

⚠️ **Warning**: Only unpublish within 72 hours of publishing

```bash
# Unpublish specific version
npm unpublish @novitus/sdk@1.0.0

# Unpublish all versions (use with extreme caution)
npm unpublish @novitus/sdk --force
```

## After Publishing

1. **Verify on npm**: Check [npmjs.com/package/@novitus/sdk](https://www.npmjs.com/package/@novitus/sdk)
2. **Test Installation**: 
   ```bash
   npm install @novitus/sdk
   ```
3. **Update Documentation**: Update external docs if needed
4. **Announce**: Share release on relevant channels

## Troubleshooting

### Publishing Fails

```bash
# Check npm credentials
npm whoami

# Re-login
npm logout
npm login

# Check package name availability
npm view @novitus/sdk
```

### Build Issues

```bash
# Clean and rebuild
rm -rf dist node_modules package-lock.json
npm install
npm run build
```

### Version Conflicts

```bash
# Check current version
npm view @novitus/sdk version

# Your local version
cat package.json | grep version
```

## Best Practices

1. **Test Before Publishing**: Always test in a real project
2. **Semantic Versioning**: Follow semver strictly
3. **Changelog**: Keep detailed changelog
4. **Backward Compatibility**: Avoid breaking changes when possible
5. **Deprecation Warnings**: Warn before removing features
6. **Documentation**: Update all docs before release
7. **Security**: Audit dependencies regularly

## Resources

- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)


