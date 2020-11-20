import {execSync} from "child_process";

const DEFAULT_OPTIONS = {
  commitDefaultValue: "unknown",
  tagDefaultValue: "unknown",
  branchDefaultValue: "unknown",

  commitConstantName: "GIT_COMMIT",
  tagConstantName: "GIT_TAG",
  branchConstantName: "GIT_BRANCH",

  showDirty: false,

  commitLength: 40,
  tagCommitLength: 0,
};

export default makePlugin({getCommit, getTag, getBranch});

export function makePlugin({getCommit, getTag, getBranch}) {
  let commit;
  let tag;
  let branch;
  let pluginOptions;

  return ({types: t}) => {
    return {
      visitor: {
        Program(path, {opts: options}) {
          pluginOptions = {...DEFAULT_OPTIONS, ...options};

          commit = getCommit(pluginOptions)
          if (!commit) {
            commit = pluginOptions.commitDefaultValue;
          } else {
            commit = commit.substring(0, pluginOptions.commitLength);
          }

          tag = getTag(pluginOptions)
          if (!tag) {
            tag = pluginOptions.tagDefaultValue;
          }

          branch = getBranch(pluginOptions)
          if (!branch) {
            branch = pluginOptions.branchDefaultValue;
          }
        },

        ReferencedIdentifier(path) {
          if (path.node.name === pluginOptions.commitConstantName) {
            path.replaceWith(t.stringLiteral(commit));
            return;
          }

          if (path.node.name === pluginOptions.tagConstantName) {
            path.replaceWith(t.stringLiteral(tag));
            return;
          }

          if (path.node.name === pluginOptions.branchConstantName) {
            path.replaceWith(t.stringLiteral(branch));
            return;
          }
        },
      },
    };
  };
}

function getCommit(opts) {
  try {
    return execSync("git rev-parse HEAD", {stdio: ["ignore", "pipe", "ignore"]}).toString().trim();
  } catch (e) {
    return null;
  }
}

function getTag(opts) {
  try {
    let cmd = ["git describe", `--abbrev=${opts.tagCommitLength}`, opts.showDirty ? "--dirty" : ""];
    return execSync(cmd.join(" "), {stdio: ["ignore", "pipe", "ignore"]}).toString().trim();
  } catch (e) {
    return null;
  }
}

function getBranch(opts) {
  try {
    let cmd = ["git rev-parse --abbrev-ref HEAD"];
    return execSync(cmd.join(" "), { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch (e) {
    return null;
  }
}
