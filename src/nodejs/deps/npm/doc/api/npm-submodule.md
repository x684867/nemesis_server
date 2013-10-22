npm-subpackage(3) -- Add a package as a git subpackage
====================================================

## SYNOPSIS

    npm.commands.subpackage(packages, callback)

## DESCRIPTION

For each package specified, npm will check if it has a git repository url
in its package.json description then add it as a git subpackage at
`node_packages/<pkg name>`.

This is a convenience only.  From then on, it's up to you to manage
updates by using the appropriate git commands.  npm will stubbornly
refuse to update, modify, or remove anything with a `.git` subfolder
in it.

This command also does not install missing dependencies, if the package
does not include them in its git repository.  If `npm ls` reports that
things are missing, you can either install, link, or subpackage them yourself,
or you can do `npm explore <pkgname> -- npm install` to install the
dependencies into the subpackage folder.

## SEE ALSO

* npm help json
* git help subpackage
