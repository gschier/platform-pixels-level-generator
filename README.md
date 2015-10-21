Platform Pixels Level Generator
===============================

Procedural level generator used for [Platform Pixels](http://platformpixels.com).

This is the tool that is currently used to create the levels that you see in
the Platform Pixels beta. This is still in early stages and will likely change
dramatically in the future.


Installation
------------

```bash
npm install -g platform-pixels-level-generator
```


Usage
-----

The `pplg` command comes with one subcommand right now, which
is `generate`. Here's the help documentation.

```bash
# Print the help
pplg generate --help

Options:
  -c, --count       number of levels to generate                    [default: 1]
  -s, --seed        random seed for generation                          [string]
  -d, --difficulty  starting difficulty                             [default: 1]
  -x, --export      Export the level to a given path                    [string]
  -v, --verbose     print each level in ascii         [boolean] [default: false]
  --help            Show help                                          [boolean]
```

```bash
# EXAMPLE: Generate and print to the command line
# NOTE: You may need to make your font smaller (or turn off wrapping) to see
# the whole thing
pplg generate --difficulty 2 --verbose

# EXAMPLE: Generate and save 5 levels to an export folder
pplg generate --difficulty 5 --count 5 --export ./levels
```


Development
-----------

```bash
# Fetch dependencies
npm install

# Link to your PATH
npm link
```
