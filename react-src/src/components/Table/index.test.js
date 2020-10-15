const data = [
  {
    stage: ["@stable/suite"],
    _id: "5f86c0e2b6e8d900179e133d",
    jobUrl:
      "https://gitlab.com/satoshilabs/trezor/trezor-suite/-/jobs/789890291",
    jobId: "789890291",
    branch: "secret-branch",
    commitMessage: "chore: just some chore...\n",
    commitSha: "bbebebd773f32f8968e6a3c0e6123f7813aa8ad7",
    duration: 349582,
    records: {
      "browser/edge": "success",
      "browser/iphone-chrome": "success",
      "browser/outdated-chrome": "success",
      "browser/outdated-firefox": "success",
      "settings/device": "success",
      "settings/general": "success",
      "settings/log": "success",
      "suite/analytics": "success",
      "suite/connecting-devices": "success",
      "suite/initial-run": "success",
      "suite/passphrase": "success",
      "suite/remembering-devices": "success",
      "suite/static-pages": "success",
    },
    __v: 0,
  },
  {
    stage: ["@stable/suite"],
    _id: "5f86c0e2b6e8d900179e133d",
    jobUrl:
      "https://gitlab.com/satoshilabs/trezor/trezor-suite/-/jobs/789890291",
    jobId: "fooId",
    branch: "secret-branch",
    commitMessage: "chore: just some chore...\n",
    commitSha: "fooSha",
    records: {
      "browser/edge": "success",
    },
    __v: 0,
  },
  {
    stage: ["@group:device-management"],
    _id: "5f86c20cb6e8d900179e133e",
    jobUrl:
      "https://gitlab.com/satoshilabs/trezor/trezor-suite/-/jobs/789895571",
    jobId: "789895571",
    branch: "tests-revisit-failing",
    commitMessage: "test(e2e): reorganize\n",
    commitSha: "bbebebd773f32f8968e6a3c0e6123f7813aa8ad7",
    duration: 104203,
    records: {
      "backup/fail-t2": "success",
      "backup/misc-t2": "success",
      "backup/success-t2": "success",
      "firmware/firmware": "success",
      "recovery/dry-run-persistence-t2": "success",
      "recovery/dry-run-t1": "success",
    },
    __v: 0,
  },
  {
    stage: ["@group:metadata"],
    _id: "5f86c20fb6e8d900179e133f",
    jobUrl:
      "https://gitlab.com/satoshilabs/trezor/trezor-suite/-/jobs/789895570",
    jobId: "789895570",
    branch: "tests-revisit-failing",
    commitMessage: "test(e2e): reorganize\n",
    commitSha: "bbebebd773f32f8968e6a3c0e6123f7813aa8ad7",
    duration: 96591,
    records: {
      "metadata/account-metadata": "success",
      "metadata/address-metadata": "success",
      "metadata/api-errors": "success",
      "metadata/interval-fetching": "success",
      "metadata/output-labeling": "success",
      "metadata/remembered-device": "success",
      "metadata/wallet-metadata": "success",
    },
    __v: 0,
  },
  {
    stage: ["@group:suite"],
    _id: "5f86c257b6e8d900179e1340",
    jobUrl:
      "https://gitlab.com/satoshilabs/trezor/trezor-suite/-/jobs/789895568",
    jobId: "789895568",
    branch: "tests-revisit-failing",
    commitMessage: "test(e2e): reorganize\n",
    commitSha: "bbebebd773f32f8968e6a3c0e6123f7813aa8ad7",
    duration: 106328,
    records: {
      "browser/edge": "success",
      "browser/iphone-chrome": "success",
      "browser/outdated-chrome": "success",
      "browser/outdated-firefox": "success",
      "settings/device": "success",
      "settings/general": "success",
      "settings/log": "success",
      "suite/analytics": "success",
      "suite/connecting-devices": "success",
      "suite/initial-run": "success",
      "suite/passphrase": "success",
      "suite/remembering-devices": "success",
      "suite/static-pages": "success",
    },
    __v: 0,
  },
  {
    stage: ["@group:onboarding"],
    _id: "5f86c2d6b6e8d900179e1341",
    jobUrl:
      "https://gitlab.com/satoshilabs/trezor/trezor-suite/-/jobs/789895573",
    jobId: "789895573",
    branch: "tests-revisit-failing",
    commitMessage: "test(e2e): reorganize\n",
    commitSha: "bbebebd773f32f8968e6a3c0e6123f7813aa8ad7",
    duration: 238968,
    records: {
      "onboarding/create-wallet-t1": "retried",
      "onboarding/create-wallet-t2": "success",
      "onboarding/hologram": "success",
      "onboarding/recovery-advanced-t1": "success",
      "onboarding/recovery-basic-t1": "success",
      "onboarding/recovery-fail-t2": "success",
      "onboarding/recovery-persistence-t2": "success",
      "onboarding/recovery-success-t2": "success",
      "onboarding/steps-order": "success",
      "onboarding/transport": "success",
      "onboarding/unexpected-states": "success",
    },
    __v: 0,
  },
  {
    stage: ["@stable/metadata"],
    _id: "5f86cb46b6e8d900179e1342",
    jobUrl:
      "https://gitlab.com/satoshilabs/trezor/trezor-suite/-/jobs/789797878",
    jobId: "789797878",
    branch: "develop",
    commitMessage: "chore: update copy\n",
    records: {
      "metadata/account-metadata": "success",
      "metadata/address-metadata": "success",
      "metadata/api-errors": "success",
      "metadata/interval-fetching": "success",
      "metadata/output-labeling": "success",
      "metadata/remembered-device": "success",
      "metadata/wallet-metadata": "success",
    },
    __v: 0,
  },
];

export default data;
