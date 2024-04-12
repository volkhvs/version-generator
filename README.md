# version-generator

This GitHub Action automates the process of generating a new version number according to the Semantic Versioning (SemVer) specification. It allows you to specify the type of version increment — major, minor, or patch — and automatically produces the new version number based on the current version. Additionally, the action can handle version prefixes (such as `v` in `v1.2.3`) that are extracted from the current version and preserved in the output.

## Inputs

### `increment_type`
The type of version increment to perform. Valid values are `major`, `minor`, or `patch`. Default value is `patch`.

### `current_version`
**Required** The current version number that you want to increment. This input should follow the SemVer format (`MAJOR.MINOR.PATCH`), and can include a prefix which will be preserved in the new version.

## Outputs

### `version`
The new version number after the increment has been applied, including any prefix present in the `current-version`.
