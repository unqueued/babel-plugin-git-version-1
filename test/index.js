/*global describe, it*/

import {transform} from "babel-core";
import {expect} from "chai";

import {makePlugin} from "../src";

describe("babel-plugin-git-version", () => {
  it("should replace commit and tag constants with commit and tag", () => {
    const commit = "381fff495d46272ec774708ce19903b2160a7d43";
    const tag = "v0.0.1";
    const branch = "master";

    const plugin = makePlugin({
      getCommit() {
        return commit;
      },

      getTag() {
        return tag;
      },

      getBranch() {
        return branch;
      }
    });

    const code = transform("console.log(GIT_COMMIT, GIT_TAG, GIT_BRANCH)", {
      plugins: [[plugin, {}]],
    }).code;

    expect(code).to.equal(`console.log("${commit}", "${tag}", "${branch}");`);
  });

  it("should replace commit and tag constants with shortened commit and tag", () => {
    const commit = "381fff495d46272ec774708ce19903b2160a7d43";
    const tag = "v0.0.1";
    const branch = "master";

    const plugin = makePlugin({
      getCommit() {
        return commit;
      },

      getTag() {
        return tag;
      },

      getBranch() {
        return branch;
      }
    });

    const code = transform("console.log(GIT_COMMIT, GIT_TAG, GIT_BRANCH)", {
      plugins: [[plugin, {
        commitLength: 5,
      }]],
    }).code;

    expect(code).to.equal(`console.log("381ff", "${tag}", "master");`);
  });

  it("should replace commit, tag and branch constants with default values", () => {
    const plugin = makePlugin({
      getCommit() {
        return null;
      },

      getTag() {
        return null;
      },

      getBranch() {
        return null;
      }
    });

    const code = transform("console.log(GIT_COMMIT, GIT_TAG, GIT_BRANCH)", {
      plugins: [[plugin, {}]],
    }).code;

    expect(code).to.equal(`console.log("unknown", "unknown", "unknown");`);
  });

  it("should replace commit, tag and branch constants with custom default values", () => {
    const plugin = makePlugin({
      getCommit() {
        return null;
      },

      getTag() {
        return null;
      },

      getBranch() {
        return null;
      }
    });

    const code = transform("console.log(GIT_COMMIT, GIT_TAG, GIT_BRANCH)", {
      plugins: [[plugin, {
        commitDefaultValue: "unknown_commit",
        tagDefaultValue: "unknown_tag",
        branchDefaultValue: "unknown_branch"
      }]],
    }).code;

    expect(code).to.equal(`console.log("unknown_commit", "unknown_tag", "unknown_branch");`);
  });

  it("should replace custom commit, tag and branch constants with custom default values", () => {
    const plugin = makePlugin({
      getCommit() {
        return null;
      },

      getTag() {
        return null;
      },

      getBranch() {
        return null;
      }
    });

    const code = transform("console.log(COMMIT, TAG, BRANCH)", {
      plugins: [[plugin, {
        commitDefaultValue: "unknown_commit",
        tagDefaultValue: "unknown_tag",
        branchDefaultValue: "unknown_branch",

        commitConstantName: "COMMIT",
        tagConstantName: "TAG",
        branchConstantName: "BRANCH"
      }]],
    }).code;

    expect(code).to.equal(`console.log("unknown_commit", "unknown_tag", "unknown_branch");`);
  });
});
