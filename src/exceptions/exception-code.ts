/* eslint-disable no-unused-vars */
enum ERROR {
  UNKNOWN = 1,
  VALIDATE_FAILED = 2,
  PERMISSION_DENIED = 3,
  DATA_NOT_FOUND = 4,
  DATA_IS_EXIST = 5,
  WORKSPACE_NOT_FOUND = 6,
  WORKSPACE_IS_EXIST = 7,
  USER_NOT_FOUND = 8,
  USER_IS_EXIST = 9,
  OWNER_WORKSPACE_NOT_FOUND = 10,
  WORKSPACE_LIMITED = 11,
  MISSING_REFRESH_TOKEN = 12,
  REFRESH_TOKEN_EXPIRED = 13,
  USER_NOT_ACTIVED = 14,
  USER_WORKSPACE_NOT_FOUND = 15,
  PASSWORD_NOT_MATCH = 16,
  ACCESS_TOKEN_EXPIRED = 17,
  CONFIG_NOT_FOUND = 18,
  CAN_NOT_REMOVE_PARENT_ORGANIZATION = 19,
  REMOVE_ORGANIZATION_NEED_TO_REMOVE_USER_WORKSPACE_ORGANIZATION = 20,
  OBJECT_NOT_VALID = 21,
  ORGANIZATION_IS_EXIST = 22,
  DUPLICATE_HOST = 23,
  ONLY_ALLOW_EXCEL_FILE = 24,
  CODE_INVITE_NOT_FOUND = 25,
  ACCOUNT_NOT_ACTIVE = 26,
  NOT_CENSOR_REQUEST_INVITE_EMAIL = 27,
  PHONE_NUMBER_DUPLICATED = 28,
  EMAIL_DUPLICATED = 29,
  SWAGGER_PERMISSION_DENIED = 30,
  LIST_DEVICE_TOKEN_INVALID = 31,
  DEVICE_TOKEN_INVALID = 32,
  TOPIC_INVALID = 33,
  OLD_PASSWORD_IS_NOT_THE_SAME_WITH_NEW_PASSWORD = 34,
  NEW_PASSWORD_NOT_MATCH = 35,
  CANNOT_CHANGE_PASSWORD_OF_LOGIN_TYPE = 36,
  SERVER_ERROR = 37,
  PERMISSION_MIDDLEWARE_DENIED_CUSTOM_JOB_POSITION = 38,
  LOGIN_WRONG_PROVIDER = 39,
  PERMISSION_DENIED_STAFF_TYPE_AND_ALL_SCOPE = 40,
  REACH_LIMIT_USER_WORKSPACE = 41,
  REQUEST_CALLBACK_TOO_MUCH = 42,
  SIGNATURE_INVALID = 43,
  FEATURE_PERMISSION_DENIED = 44,
  INTEGRATION_ERROR = 45,
  WORKSPACE_NAME_IS_NOT_ALLOWED = 46,
  CANNOT_GET_STATISTIC_IN_FUTURE = 47,
  CANNOT_INITIAL_WORKSPACE_DATA = 48,
  USER_WORKSPACE_INVALID_TYPE = 49,

  /**
   * otm- SHIFT - 1200 -> 1299
   */
  SHIFT_TIME_INPUT_INVALID = 1200,
  SHIFT_WEEKDAY_REQUIRE = 1201,

  /**
   * COURSE ERROR 1300 --> 1399
   */
  COURSE_NOT_FOUND = 1300,
  CLASSROOM_NOT_FOUND = 1301,
  CLASS_NOT_FOUND = 1302,
  SCORE_INVALID = 1303,
  EVALUATION_NOT_FOUND = 1304,
  EVALUATION_OPTION_NOT_FOUND = 1305,
  /**
   * * Organization
   */
  ORGANIZATION_USER_INVALID = 100,
  ORGANIZATION_NOT_FOUND = 101,
  ORGANIZATION_MAIN_MANAGER_NOT_FOUND = 102,
  CREATE_ORGANIZATION_PERMISSION_DENIED = 103,
  UPDATE_ORGANIZATION_PERMISSION_DENIED = 104,
  DELETE_ORGANIZATION_PERMISSION_DENIED = 105,
  MANAGER_NOT_FOUND = 106,

  /**
   * * User Workspace Organization
   */
  USER_WORKSPACE_ORGANIZATION_INVALID = 200,
  USER_WORKSPACE_ORGANIZATION_EXISTED = 201,
  INVITE_USER_TO_ORGANIZATION_SUCCESSFULLY = 202,
  USER_WORKSPACE_ORGANIZATION_NOT_FOUND = 203,
  CREATE_USER_WORKSPACE_ORGANIZATION_PERMISSION_DENIED = 204,
  UPDATE_USER_WORKSPACE_ORGANIZATION_PERMISSION_DENIED = 205,
  DELETE_USER_WORKSPACE_ORGANIZATION_PERMISSION_DENIED = 206,
  CHANGE_USER_WORKSPACE_ORGANIZATION_PERMISSION_DENIED = 207,
  EXPORT_STAFF_BY_ORGANIZATION_PERMISSION_DENIED = 208,
  CANNOT_HAVE_PERMISSION_TO_VIEW_THIS_ORGANIZATION = 209,

  /**
   * * User Invite Config
   */
  USER_INVITE_CONFIG_NOT_FOUND = 300,
  USER_INVITE_CONFIG_EXPIRED = 301,
  USER_INVITE_CONFIG_NOT_VALID = 302,
  REQUIRE_USER_INVITE_LINK_EMAIL_OR_CONTACT_ADMIN = 303,

  /**
   * * User Workspace
   */
  USER_WORKSPACE_EXISTED = 400,
  USER_WORKSPACE_STILL_WORKING = 401,
  LEADER_NOT_FOUND = 402,
  LIMIT_CHECKIN_IMAGES = 403,
  INVALID_END_WORK_DATE = 404,
  USER_WORKSPACE_IS_RETIRED_LOGIN_CASE = 405,
  USER_WORKSPACE_IS_NOT_WORKSPACE_OWNER = 406,
  VIEW_USER_WORKSPACE_PERMISSION_DENIED = 407,
  UPDATE_USER_WORKSPACE_PERMISSION_DENIED = 408,
  STAFF_CODE_IS_DUPLICATE = 409,
  CANNOT_CHANGE_YOUR_WORKING_STATUS = 410,
  CANNOT_CHANGE_WORKSPACE_OWNER_WORKING_STATUS = 411,
  CAN_NOT_CHANGE_WORKSPACE_OWNER_TO_YOURSELF = 412,
  CHANGE_WORKING_STATUS_USER_WORKSPACE_PERMISSION_DENIED = 413,
  USER_WORKSPACE_WORK_PROGRESS_NOT_FOUND = 414,
  CAN_NOT_DELETE_OR_UPDATE_WORK_PROGRESS_TYPE_AUTO = 415,
  FROM_DATE_MUST_EQUAL_LESS_THAN_TO_DATE = 416,
  USER_WORKSPACE_WORK_PROGRESS_DUPLICATED = 417,
  WORK_PROGRESS_WORKPLACE_CAN_NOT_EMPTY = 418,
  WORK_PROGRESS_JOB_POSITION_CAN_NOT_EMPTY = 419,
  WORK_PROGRESS_MANUAL_MUST_EQUAL_SMALL_THAN_START_WORK_DATE = 420,
  FROM_DATE_AND_TO_DATE_MUST_SAME_YEAR = 421,
  USER_WORKSPACE_RETIRE_ERROR = 422,
  UPLOAD_EXCEED_LIMIT_CHECKIN_IMAGES = 423,
  TO_DATE_MUST_EQUAL_LESS_THAN_ONE_MONTH = 424,

  /**
   * * Workspace Invite Config
   */
  WORKSPACE_INVTE_CONFIG_NOT_FOUND = 500,

  /**
   * * Group Permission
   */
  GROUP_PERMISSION_NOT_FOUND = 600,
  GROUP_PERMISSION_EXISTED = 601,
  CREATE_GROUP_PERMISSION_DENIED = 602,
  UPDATE_GROUP_PERMISSION_DENIED = 603,
  GROUP_PERMISSION_CAN_NOT_DELETE = 604,
  ONLY_OWNER_CAN_ADD_USER_TO_GROUP_SUPER_ADMIN = 605,
  USER_WORKSPACE_ALREADY_SUPER_ADMIN = 606,
  ONLY_OWNER_CAN_CHANGE_USER_TO_GROUP_SUPPER_ADMIN = 607,
  ONLY_OWNER_CAN_REMOVE_SUPER_ADMIN_USER = 608,
  ONLY_OWNER_CAN_CHANGE_USER_TO_GROUP_SUPER_ADMIN = 609,
  CAN_NOT_CHANGE_SUPER_ADMIN_USER_PERMISSION = 610,
  CAN_NOT_CHANGE_USER_TO_GROUP_ADMIN = 611,
  OWNER_CANNOT_REMOVE_ITSELF_FROM_GROUP_SUPER_ADMIN = 612,
  USER_CANNOT_REMOVE_SUPER_ADMIN_USER_PERMISSION = 613,
  ONLY_YOU_CAN_REMOVE_YOURSELF_FROM_GROUP_SUPER_ADMIN = 614,
  CUSTOM_ORGANIZATION_CAN_NOT_EMPTY = 615,

  /**
   * * User Workspace Permission
   */
  USER_WORKSPACE_NOT_SUPER_ADMIN_CHANGE_OWNER = 700,
  USER_WORKSPACE_PERMISSION_NOT_FOUND = 701,
  CAN_NOT_CHANGE_GROUP_PERMISSION_OF_OWNER = 702,

  /**
   * * Coefficient
   */
  COEFFICIENT_CODE_NOT_FOUND = 1100,
  COEFFICIENT_CODE_IS_EXIST = 1101,
  COEFFICIENT_CODE_CANNOT_REMOVE_HAS_RELATION_INFORMATION_EXISTED = 1102,
  COEFFICIENT_CODE_ACTIVE = 1103,

  /**
   * * Coefficient Region
   */
  COEFFICIENT_REGION_CODE_IS_EXIST = 900,
  COEFFICIENT_CODE_REGION_NOT_FOUND = 901,
  COEFFICIENT_CODE_REGION_CANNOT_REMOVE_HAS_RELATION_INFORMATION_EXISTED = 902,
  COEFFICIENT_REGION_CODE_ACTIVE = 903,
  EXPIRES_DATE_CAN_NOT_LESS_THAN_VALID_DATE = 904,
  EXPIRES_DATE_CAN_NOT_LESS_THAN_NOW = 905,
  COEFFICIENT_REGION_IS_EXIST = 906,

  /**
   * * Occupations
   */
  UNIVERSITY_CODE_NOT_FOUND = 1200,
  UNIVERSITY_CODE_IS_EXIST = 1201,
  UNIVERSITY_CODE_CANNOT_REMOVE_HAS_RELATION_INFORMATION_EXISTED = 1202,
  MAJOR_CODE_NOT_FOUND = 1300,
  MAJOR_CODE_IS_EXIST = 1301,
  MAJOR_CODE_CANNOT_REMOVE_HAS_RELATION_INFORMATION_EXISTED = 1302,
  OCCUPATION_CODE_NOT_FOUND = 1400,
  OCCUPATION_CODE_IS_EXIST = 1401,
  OCCUPATION_CODE_CANNOT_REMOVE_HAS_RELATION_INFORMATION_EXISTED = 1402,
  INVALID_UNIVERSITY_DATA = 1403,
  INVALID_OCCUPATION_DATA = 1404,

  /**
   * * Occupations
   */
  USER_WORKSPACE_TRAINING_CODE_NOT_FOUND = 2400,
  END_DATE_TRAINING_MUST_EQUAL_LARGER_THAN_START_DATE_TRAINING = 2401,
  DIPLOMA_RETURN_DATE_MUST_EQUAL_LARGER_THAN_DIPLOMA_SUBMISSION_DATE = 2402,

  /*
   * * Staff type
   */
  STAFF_TYPE_INVALID = 800,
  STAFF_TYPE_NOT_FOUND = 801,
  STAFF_TYPE_IS_EXIST = 802,
  STAFF_TYPE_CANNOT_UPDATE = 803,
  CANNOT_REMOVE_ACTIVE_STAFF_TYPE = 804,
  CANNOT_REMOVE_OR_INACTIVE_DEFAULT_STAFF_TYPE = 805,

  /**
   * * Health facility
   */
  HEALTH_FACILITY_INVALID = 900,
  HEALTH_FACILITY_NOT_FOUND = 901,
  HEALTH_FACILITY_IS_EXIST = 902,
  HEALTH_FACILITY_CANNOT_UPDATE = 903,
  HEALTH_FACILITY_TYPE_INVALID = 904,
  HEALTH_FACILITY_TYPE_NOT_FOUND = 905,
  HEALTH_FACILITY_TYPE_IS_EXIST = 906,
  HEALTH_FACILITY_TYPE_CANNOT_UPDATE = 907,
  HEALTH_EXAMINATION_DATE_INVALID = 908,
  HEALTH_EXAMINATION_INVALID = 909,
  HEALTH_EXAMINATION_NOT_FOUND = 909,
  HEALTH_EXAMINATION_IS_EXIST = 909,
  HEALTH_EXAMINATION_CANNOT_UPDATE = 910,

  /**
   * * Labor contract
   */
  LABOR_CONTRACT_NOT_EXIST = 1000,
  LABOR_CONTRACT_EXISTED = 1001,
  USER_WORKSPACE_LABOR_CONTRACT_NOT_FOUND = 1002,
  USER_WORKSPACE_LABOR_CONTRACT_EXISTED = 1003,
  LABOR_CONTRACT_SIGN_DATE_INVALID = 1004,
  LABOR_CONTRACT_EFFECT_DATE_INVALID = 1005,
  LABOR_CONTRACT_EXPIRES_DATE_INVALID = 1006,
  LABOR_CONTRACR_ACTIVE_DUPLICATE = 1007,
  USER_WORKSPACE_LABOR_CONTRACT_DUPLICATE_TIME = 1008,
  CAN_NOT_REMOVE_USER_LABOR_CONTRACT_ACTIVE = 1009,
  CAN_NOT_UPDATE_EXPIRE_LABOR_SMALLER_THAN_CURRENT_DATE = 1010,
  LABOR_CONTRACT_NUMBER_DUPLICATED = 1011,
  ONLY_CHANGE_LABOR_CONTRACT_PENDING = 1012,
  CAN_NOT_UPDATE_CONTRACT_WHEN_HAVE_CONTRACT_ACTIVE = 1013,
  NOT_CHANGE_LABOR_CONTRACT_EXPIRED = 1014,
  NOT_CHANGE_LABOR_CONTRACT_DATE_GREATER_THAN_DATE_EXPRECT = 1015,
  NOT_CHANGE_INFO_IN_CONTRACT_ACTIVE = 1016,
  NOT_CHANGE_EFFECT_DATE_OF_LABOR_CONTRACT_ACTIVE = 1017,
  NOT_CHANGE_LABOR_CONTRACT_ACTIVE = 1018,
  CAN_NOT_DELETE_LABOR_CONTRACT_WHEN_ACTIVE = 1019,
  CAN_NOT_DELETE_LABOR_CONTRACT_WHEN_HAVE_USER = 1020,
  CAN_NOT_CHANGE_STATUS_LABOR_CONTRACT_WHEN_HAVE_USER = 1021,
  CAN_NOT_UPDATE_LABOR_CONTRACT_WHEN_HAVE_USER = 1022,
  LABOR_CONTRACT_EFFECT_DATE_IN_SALARY_PERIOD = 1023,
  SALARY_METHOD_CONFIG_RANK_IS_REQUIRED = 1024,
  LABOR_CONTRACT_TEMPLATE_URL_NOT_EXIST = 1025,
  CAN_NOT_CREATE_NOTIFICATION_LABOR_CONTRACT_EXPIRE = 1026,
  LABOR_CONTRACT_EXPIRE_NOT_FOUND = 1027,
  CANNOT_UPDATE_LABOR_CONTRACT_IN_PAST_SALARY_PERIOD = 1028,
  NOT_REMOVE_LABOR_CONTRACT_EXPIRED = 1029,

  /*
   * * Job title
   */
  JOB_TITLE_GROUP_INVALID = 1100,
  JOB_TITLE_GROUP_NOT_FOUND = 1101,
  JOB_TITLE_GROUP_IS_EXIST = 1102,
  JOB_TITLE_GROUP_CANNOT_UPDATE = 1103,
  JOB_TITLE_INVALID = 1104,
  JOB_TITLE_NOT_FOUND = 1105,
  JOB_TITLE_IS_EXIST = 1106,
  JOB_TITLE_CANNOT_UPDATE = 1107,

  /*
   * * User Workspace Personal Tax
   */
  USER_WORKSPACE_PERSONAL_TAX_NOT_FOUND = 1400,
  USER_WORKSPACE_PERSONAL_TAX_CODE_EXISTED = 1401,
  USER_WORKSPACE_PERSONAL_TAX_EXISTED = 1402,

  /*
   * * Discipline
   */
  DISCIPLINE_NOT_FOUND = 1500,
  CAN_NOT_DELETE_ACTIVE_DISCIPLINE = 1501,
  DISCIPLINE_CODE_EXISTED = 1502,
  CAN_NOT_UPDATE_DISCIPLINE_HAS_RELATION_DATA = 1503,

  /*
   * * Discipline Behavior
   */
  DISCIPLINE_BEHAVIOR_NOT_FOUND = 1600,
  CAN_NOT_DELETE_ACTIVE_DISCIPLINE_BEHAVIOR = 1601,
  DISCIPLINE_BEHAVIOR_CODE_EXISTED = 1602,
  CAN_NOT_UPDATE_DISCIPLINE_BEHAVIOR_HAS_RELATION_DATA = 1603,

  /*
   * * Insurance
   */
  INSURANCE_NOT_FOUND = 1700,
  CAN_NOT_DELETE_ACTIVE_INSURANCE = 1701,
  INSURANCE_CODE_EXISTED = 1702,

  /**
   * * Bank
   */
  BANK_CODE_EXISTED = 1800,
  BANK_NOT_FOUND = 1801,
  CAN_NOT_DELETE_ACTIVE_BANK = 1802,

  /**
   * * Bank Branch
   */
  BANK_BRANCH_CODE_IS_EXIST = 1900,
  BANK_BRANCH_NOT_FOUND = 1901,
  BANK_BRANCH_NAME_EXISTED = 1902,
  CAN_NOT_DELETE_ACTIVE_BANK_BRANCH = 1903,

  /**
   * * User Workspace Bank Account
   */
  USER_WORKSPACE_BANK_ACCOUNT_NOT_FOUND = 2000,
  CAN_NOT_DELETE_SALARY_BANK_ACCOUNT = 2001,
  ALREADY_HAVE_SALARY_BANK_ACCOUNT = 2002,

  /*
   * * Reward Title Type
   */
  REWARD_TITLE_TYPE_NOT_FOUND = 2100,
  CAN_NOT_DELETE_ACTIVE_REWARD_TITLE_TYPE = 2101,
  REWARD_TITLE_TYPE_CODE_EXISTED = 2102,
  REWARD_TITLE_NOT_FOUND = 2103,
  CAN_NOT_DELETE_ACTIVE_REWARD_TITLE = 2104,
  REWARD_TITLE_CODE_EXISTED = 2105,

  REWARD_DECISION_NOT_FOUND = 2106,
  CAN_NOT_DELETE_OR_UPDATE_APPROVED_REWARD_DECISION = 2107,
  REWARD_DECISION_NUMBER_EXISTED = 2108,

  APPLICABLE_INDIVIDUAL_REWARD_CAN_NOT_EMPTY = 2109,
  APPLICABLE_GROUP_REWARD_CAN_NOT_EMPTY = 2110,

  DISCIPLINE_DECISION_NOT_FOUND = 2111,
  CAN_NOT_DELETE_OR_UPDATE_APPROVED_DISCIPLINE_DECISION = 2112,
  DISCIPLINE_DECISION_NUMBER_EXISTED = 2113,

  APPLICABLE_INDIVIDUAL_DISCIPLINE_CAN_NOT_EMPTY = 2114,
  APPLICABLE_GROUP_DISCIPLINE_CAN_NOT_EMPTY = 2115,

  CAN_NOT_UPDATE_REWARD_TITLE_TYPE_HAS_RELATION_DATA = 2116,
  CAN_NOT_UPDATE_REWARD_TITLE_HAS_RELATION_DATA = 2117,

  /**
   * * Allowance
   */
  ALLOWANCE_TYPE_IS_EXISTED = 2200,
  ALLOWANCE_TYPE_NOT_FOUND = 2201,
  ALLOWANCE_IS_EXISTED = 2202,
  ALLOWANCE_NOT_FOUND = 2203,
  CAN_NOT_DELETE_ALLOWANCE_TYPE = 2204,
  CAN_NOT_DELETE_ALLOWANCE = 2205,
  USER_WORKSPACE_ALLOWANCE_NOT_FOUND = 2206,
  CANNOT_DELTE_USER_WORKSPACE_ALLOWANCE = 2207,
  USER_WORKSPACE_ALLOWANCE_EXISTED = 2208,
  USER_WORKSPACE_ALLOWANCE_EXPIRED = 2209,
  USER_WORKSPACE_ALLOWANCE_EXPIRES_TODAY = 2210,
  VALID_EXPIRES_DATE_MUST_LARGER_EQUAL_THAN_CURRENT_SALARY_PERIOD = 2211,
  CUSTOM_USER_WORKSPACE_ALLOWANCE_EXISTED = 2212,
  CANNOT_UPDATE_USER_WORKSPACE_ALLOWANCE_APPLIED_IN_THE_PAST = 2213,
  CANNOT_UPDATE_VALID_DATE_OF_USER_WORKSPACE_ALLOWANCE_APPLIED_IN_THE_PAST = 2214,
  ONLY_ALLOW_CHANGE_EXPIRES_DATE_FOR_USER_WORKSPACE_ALLOWANCE_IN_THE_PAST = 2215,
  CANNOT_REMOVE_APPLIED_USER_WORKSPACE_ALLOWANCE = 2216,
  NOT_CREATE_USER_WORKSPACE_ALLOWANCE_IN_PAST = 2217,
  CAN_NOT_REMOVE_ALLOWANCE_HAVE_STAFF_APPLY = 2218,

  /**
   * * Job position
   */
  JOB_POSITION_HAS_ALREADY_EXISTED = 2300,
  JOB_POSITION_NOT_FOUND = 2301,
  USER_WORKSPACE_JOB_POSITION_HAS_ALREADY_EXISTED = 2302,
  USER_WORKSPACE_JOB_POSITION_NOT_FOUND = 2303,
  INVALID_EXPIRES_DATE = 2304,
  INVALID_VALID_DATE = 2305,
  JOB_POSITION_ROLE_NOT_VALID = 2305,
  ONLY_ALLOW_ONE_HEAD_MANAGER_JOB_POSITION = 2306,
  ONLY_ALLOW_ONE_SUB_MANAGER_JOB_POSITION = 2307,
  HAS_STAFF_IN_JOB_POSITION = 2308,
  NOT_ALLOW_TO_REMOVE_MANAGER_JOB_POSITION = 2309,

  /**
   * * Family Relation
   */
  FAMILY_RELATION_CODE_EXISTED = 2400,
  FAMILY_RELATION_NOT_FOUND = 2401,
  USER_WORKSPACE_FAMILY_RELATION_YEAR_OF_BIRTH_INVALID = 2402,
  USER_WORKSPACE_FAMILY_RELATION_INVALID = 2403,
  USER_WORKSPACE_FAMILY_RELATION_NOT_FOUND = 2404,
  USER_WORKSPACE_FAMILY_RELATION_IS_EXIST = 2405,
  USER_WORKSPACE_FAMILY_RELATION_CANNOT_UPDATE = 2406,
  DEPENDENT_FROM_TIME_IS_REQUIRED = 2407,
  DEPENDENT_TO_TIME_ERROR = 2408,

  /**
   * User workspace social insurance
   */
  USER_WORKSPACE_SOCIAL_INSURANCE_NOT_FOUND = 2501,
  USER_WORKSPACE_HEALTH_INSURANCE_NOT_FOUND = 2502,
  USER_WORKSPACE_INSURANCE_NOT_FOUND = 2503,
  INSURANCE_START_DATE_MUST_EQUAL_LARGER_THAN_CONTRACT_SIGNING_DATE = 2504,
  INSURANCE_END_DATE_MUST_LARGER_THAN_INSURANCE_START_DATE = 2505,
  USER_WORKSPACE_SOCIAL_INSURANCE_EXISTED = 2506,
  USER_WORKSPACE_HEALTH_INSURANCE_EXISTED = 2507,
  USER_WORKSPACE_INSURANCE_EXISTED = 2508,

  /**
   * * Leave Type
   */
  LEAVE_RULE_TYPE_INVALID = 2601,
  LEAVE_SCOPE_SPECIFIED_NOT_FOUND = 2602,
  LEAVE_TYPE_EXISTED = 2603,
  LEAVE_TYPE_NOT_FOUND = 2604,
  USER_WORKSPACE_LEAVE_SCOPES_NOT_FOUND = 2605,
  THE_REDUCED_BALANCE_CANNOT_BE_GREATER_THAN_THE_CURRENT_BALANCE = 2607,
  LEAVE_SCOPE_STAFF_TYPE_NOT_FOUND = 2608,
  USER_WORKSPACE_LEAVE_STATISTIC_NOT_FOUND = 2609,
  NOT_ALLOW_TO_APPLY_IN_PAST = 2610,
  USER_WORKSPACE_LEAVE_APPLIANCE_IS_EXIST = 2611,
  USER_WORKSPACE_LEAVE_TYPE_APPLIANCE_NOT_FOUND = 2612,
  CANNOT_DELETE_USER_WORKSPACE_LEAVE_TYPE_APPLIANCE_IN_THE_PAST = 2613,
  CANNOT_SEND_APPLIANCE_IN_DAY_WITHOUT_SHIFT = 2614,
  ATTACH_FILE_IS_REQUIRED = 2615,
  CAN_NOT_CLAIM_LEAVE_TYPE_WORKING_DAY_WITH_TYPE_UNLIMITED = 2616,
  LEAVE_TYPE_OVERTIME_EXISTED = 2617,
  LEAVE_TYPE_OVERTIME_NOT_FOUND = 2618,
  LEAVE_TYPE_OVERTIME_BALANCE_NOT_ENOUGH = 2619,

  /**
   * * Shift
   */
  SHIFT_NOT_FOUND = 2700,
  FROM_TIME_MUST_EQUAL_LESS_THAN_TO_TIME = 2701,
  TIME_SHIFT_BREAK_MUST_BE_WITHIN_THE_TIME_SHIFT = 2702,
  CANNOT_REMOVE_SHIFT_INITIAL_DEFAULT = 2703,
  SHIFT_CODE_IS_EXIST = 2704,
  SHIFT_TIME_COMPENSATIONS_NOT_VALID = 2705,
  TIME_SHIFT_HOUR_DUPLICATE = 2706,
  ALLOW_CHECKIN_LATE_MINUTES_MUST_LESS_THAN_NOT_CHECKIN_AFTER_MINUTES = 2707,
  ALLOW_CHECKIN_EARLY_TIME_MUST_LESS_THAN_FROM_TIME = 2708,
  ALLOW_CHECKOUT_EARLY_MINUTES_MUST_LESS_THAN_NOT_CHECKOUT_BEFORE_MINUTES = 2709,
  ALLOW_CHECKOUT_LATE_TIME_MUST_GREATER_THAN_TO_TIME = 2710,
  TIME_NEXT_SHIFT_HOUR_MUST_GREATER_THAN_PREV_SHIFT_HOUR = 2711,
  TOTAL_SHIFT_HOURS_IS_WRONG = 2712,
  TIME_SHIFT_HOUR_NOT_VALID = 2713,
  SHIFT_HOUR_INVALID = 2714,
  SHIFT_BREAK_INVALID = 2715,
  CONFIG_TIME_SHIFT_HOUR_NOT_VALID = 2716,
  APPLY_DATE_MUST_EQUAL_LARGER_THAN_NOW = 2717,
  SHIFT_APPLY_DATE_INVALID = 2718,
  SHIFT_GROUP_NOT_FOUND = 2719,
  SHIFT_GROUP_CODE_EXISTED = 2720,
  DAY_OFF_GROUP_CAN_NOT_EMPTY = 2721,
  SHIFT_CAN_NOT_EMPTY = 2722,
  SHIFT_GROUP_SCHEDULE_NOT_FOUND = 2723,
  SHIFT_GROUP_DUPLICATE = 2724,
  SHIFT_FLEXIBLE_NOT_EMPTY = 2725,
  SHIFT_GROUP_FLEXIBLE_NOT_FOUND = 2726,
  SHIFT_GROUP_SCHEDULE_SHIFT_INVALID = 2727,
  SHIFT_GROUP_USER_WORKSPACE_OUT_OF_SCOPE = 2728,
  RANGE_TIME_SHIFT_HOUR_MUST_LESS_THAN_24_HOUR = 2729,
  CANNOT_REMOVE_SHIFT_EXISTING_IN_SHIFT_GROUP = 2730,
  CANNOT_REMOVE_DAY_OF_GROUP_EXISTING_IN_SHIFT_GROUP = 2731,
  SHIFT_EXISTING_IN_SHIFT_GROUP_SPECIAL_DATE = 2732, // fixed for alert FE
  DAY_OF_EXISTING_IN_SHIFT_GROUP = 2733, // fixed for alert FE
  SHIFT_APPLIED_SHIFT_SCHEDULE_DUPLICATE = 2734,
  SHIFT_HOUR_APPLIED_SHIFT_GROUP_DUPLICATE = 2735,
  CANNOT_UPDATE_SHIFT_GROUP_SCHEDULE_IN_THE_PAST = 2736,
  CREATE_SHIFT_GROUP_SUCCESS_BUT_CREATE_SCHEDULE_FAIL = 2737,
  SHIFT_APPLY_DUPLICATE_IN_CURRENT_DATE = 2738,
  SHIFT_APPLY_DUPLICATE_IN_OTHER_DATE = 2739,

  /**
   * * Shift group special date
   */
  SHIFT_GROUP_SPECIAL_DATE_NOT_FOUND = 2800,
  SHIFT_GROUP_SPECIAL_DATE_EXISTED = 2801,
  SELECT_A_SHIFT_FOR_THE_SHIFT_GROUP_SPECIAL_DATE = 2802,
  SHIFT_GROUP_SPECIAL_DATE_NOT_VALID = 2803,

  /**
   * * Shift Group
   */
  CANNOT_REMOVE_SHIFT_GROUP_INITIAL_DEFAULT = 2900,
  STAFF_IN_SHIFT_GROUP_EXISTED = 2901,
  DAY_OF_WEEK_CANNOT_BE_DUPLICATED = 2902,
  SHIFT_GROUP_FIXED_NOT_FOUND = 2903,
  WORKING_HOUR_NOT_EMPTY = 2904,
  UNABLE_TO_SELECT_A_SHIFT_WITH_THE_SAME_TIME_AS_THE_SHIFT_OF_ANOTHER_DAY = 2905,
  WORKING_HOUR_INVALID = 2906,
  WORKING_HOUR_MUST_LESS_THAN_24_HOUR = 2907,
  CAN_NOT_EXPORT_SCHEDULE_ON_THE_PASS = 2908,
  SOURCE_SHIFT_CAN_NOT_EQUAL_DESTINATION_SHIFT = 2909,
  USER_WORKSPACE_ALREADY_HAS_THIS_SHIFT_IN_DATE = 2910,
  MUST_CHOOSE_SOURCE_SHIFT_TO_CHANGE_SHIFT = 2911,
  MUST_CHOOSE_DESTINATION_SHIFT_TO_CHANGE_SHIFT = 2912,
  CANNOT_SHIFT_WITH_HOUR_INVALID = 2913,
  NOT_CHANGE_SHIFT_WHEN_END_SHIFT_HOUR = 2914,
  USER_WORKSPACE_DONT_HAVE_SHIFT_IN_DATE = 2915,
  SHIFT_APPLY_DUPLICATE_WITH_USER_WORKSPACE_SHIFT = 2916,
  USER_WORKSPACE_ALREADY_HAS_SHIFT_IN_DATE = 2917,

  /**
   * Rotate shift appliance
   */
  CANNOT_ROTATE_SHIFT_APPLIANCE_ON_THE_PAST = 3000,
  USER_WORKSPACE_NOT_IN_SHIFT_GROUP_SCHEDULE_OR_SHIFT_GROUP_SCHEDULE_DATE = 3001,
  INVALID_REQUEST_APPLIANCE_TIME = 3002,
  SOURCE_ROTATE_SHIFT_CAN_NOT_EQUAL_DESTINATION_ROTATE_SHIFT = 3003,
  ROTATE_SHIFT_APPLIANCE_NOT_FOUND = 3004,
  CANNOT_REMOVE_ROTATE_SHIFT_APPLIANCE = 3005,

  /**
   * * Shift schedule appliance
   */
  TOTAL_MINUTES_REMOTE_WORKING_APPLIANCE_INVALID = 3100,
  CANNOT_SEND_REMOTE_WORKING_APPLIANCE_IN_DAY_WITHOUT_SHIFT = 3101,
  CANNOT_SEND_REMOTE_WORKING_APPLIANCE_DUPLICATE_LEAVE_APPLIANCE = 3102,
  CHECKIN_IMAGE_REQUEST = 3103,
  CHECKIN_LOCATION_REQUEST = 3104,
  CHECKIN_DATE_INVALID = 3105,

  /**
   * * Shift schedule appliance
   */
  SHIFT_SCHEDULE_APPLIANCE_NOT_FOUND = 3300,
  CANNOT_REMOVE_SHIFT_SCHEDULE_APPLIANCE = 3301,

  /**
   * * Shift appliance
   */
  SHIFT_APPLIANCE_DUPLICATE_IN_DATE = 3400, // Fixed for FE
  DATES_APPLIANCE_INVALID = 3401,
  SHIFT_APPLIANCE_EXISTED = 3402,
  CAN_NOT_REQUEST_APPLIANCE_USER_WORKSPACE_NOT_IN_SHIFT_GROUP_SCHEDULE = 3403,
  SHIFT_APPLIANCE_DUPLICATE_AUTO_REJECT = 3404,

  /**
   * * Minimum amount
   */
  MINIMUM_AMOUNT_NOT_FOUND = 3500,
  MINIMUM_AMOUNT_CODE_EXISTED = 3501,
  MINIMUM_AMOUNT_SCOPES_INVALID = 3502,
  MINIMUM_NORM_INVALID_DATE = 3503,
  MINIMUM_NORM_NOT_FOUND = 3504,
  CANNOT_EDIT_NORM_TYPE = 3505,
  CANNOT_EDIT_MINIMUM_NORM_IN_THE_PAST = 3506,
  NORM_TYPE_NOT_VALID = 3507,
  CANNOT_EDIT_MINIMUM_NORM_VALUE_IN_THE_PAST = 3508,
  MINIMUM_AMOUNT_SCOPE_TYPE_ALL_EXISTED = 3509,
  MINIMUM_AMOUNT_SCOPE_TYPE_NONE_NOT_VALID = 3510,

  /**
   * * Salary method config
   */
  SALARY_METHOD_CONFIG_NOT_FOUND = 3600,
  CANNOT_REMOVE_APPLIED_SALARY_METHOD_CONFIG = 3601,
  SALARY_METHOD_CONFIG_INVALID_DATE = 3602,
  SALARY_PAY_METHOD_NOT_EMPTY = 3603,
  SALARY_PAY_METHOD_PERCENT_MUST_EQUAL_100 = 3604,
  SALARY_GRADE_NOT_EMPTY = 3605,
  SALARY_RANK_NOT_EMPTY = 3605,
  CANNOT_UPDATE_SALARY_METHOD_CONFIG_APPLIED_IN_THE_PAST = 3606,
  CANNOT_UPDATE_VALID_DATE_OF_SALARY_METHOD_CONFIG_APPLIED_IN_THE_PAST = 3607,
  VALID_DATE_MUST_LARGER_THAN_CURRENT_DATE_AND_LESS_THAN_EXPIRES_DATE = 3608,
  ONLY_ALLOW_CHANGE_EXPIRES_DATE_FOR_SALARY_METHOD_CONFIG_IN_THE_PAST = 3609,
  SALARY_PAY_METHOD_DUPLICATED = 3610,
  CANNOT_CHANGE_SALARY_METHOD_CONFIG_OF_IN_THE_PAST = 3611,
  VALID_DATE_MUST_BE_IN_CURRENT_SALARY_PERIOD = 3612,

  /**
   * * Meeting
   */
  OFFICE_MEETING_ROOM_NOT_FOUND = 3700,
  REACH_LIMIT_DAY_BOOKING_IN_ADVANCE = 3701,
  BOOKING_TIME_NOT_VALID = 3702,
  REACH_LIMIT_BOOKING_TIME = 3703,
  OFFICE_MEETING_ROOM_PERMISSION_DENIED = 3704,
  REPEAT_END_DATE_IS_NOT_EMPTY = 3705,
  REPEAT_DATE_IS_NOT_VALID = 3706,
  CANNOT_CREATE_MEETING_IN_THE_PAST = 3707,
  CUSTOM_REPEAT_INVALID = 3708,
  CUSTOM_MESSAGE_DUPLICATE_MEETING_ROOM = 3709,
  MEETING_NOT_FOUND = 3710,
  CANNOT_DELETE_MEETING_IN_THE_PAST = 3711,
  ONLY_HOST_CAN_DELETE_MEETING = 3712,
  MEMBER_MEETING_NOT_FOUND = 3713,
  ALREADY_APPROVED_OR_REJECTED_MEETING_REQUEST = 3714,
  CAN_NOT_CHANGE_STATUS_MEETING_REQUEST_IN_THE_PAST = 3715,
  REACH_LIMIT_TIME_APPROVED_OR_REJECTED_MEETING_REQUEST = 3716,
  CANNOT_CHANGE_MEETING_HOST_STATUS = 3717,
  INVALID_TIME_UPDATE_MEETING_REPORT = 3718,
  ONLY_HOST_CAN_UPDATE_MEETING_REPORT = 3719,
  MEETING_REPORT_NOT_FOUND = 3720,
  REACH_LIMIT_UPLOAD_MEETING_REPORT_FILE_AND_IMAGE = 3721,
  CANNOT_UPDATE_MEETING_IN_THE_PAST = 3722,
  SCHEDULE_OPTION_CANNOT_EMPTY = 3723,
  REPEAT_LAST_WEEK_IN_MONTH_NOT_VALID = 3724,
  REPEAT_LAST_DAY_IN_MONTH_NOT_VALID = 3725,
  MEETING_GROUP_NOT_FOUND = 3726,
  INVALID_OFFICE_MEETING_ROOM_VALID_TIME = 3727,
  CANNOT_EXPORT_MEETING_CHECKIN_IN_THE_FUTURE = 3728,
  CANNOT_EXPORT_MEETING_NOT_REQUIRE_CHECKIN = 3729,
  MEETING_QR_CODE_INVALID = 3730,
  CHECKIN_MEETING_TIME_INVALID = 3731,
  CHECKOUT_MEETING_TIME_INVALID = 3732,
  MEETING_IS_OVER = 3733,
  CHECKIN_MEETING_SUCCESSFULLY = 3734,
  CANNOT_UPDATE_MEETING_IS_HAPPENING = 3735,
  CANNOT_UPDATE_MEETING_TO_THE_PAST = 3736,
  CANNOT_CHANGE_STATUS_OF_MEETING_REQUIRE_ATTENDANCE = 3737,
  CANNOT_UPDATE_DEFAULT_MEETING_GROUP = 3738,
  INVALID_REPEAT_MEETING_END_DATE = 3739,
  MEETING_ALREADY_BLOCKED = 3740,

  /**
   * * Approval
   */
  APPROVAL_GROUP_EXISTED = 5000,
  APPROVAL_GROUP_NOT_FOUND = 5001,
  APPROVAL_EXISTED = 5002,
  APPROVAL_NOT_FOUND = 5003,
  CAN_NOT_DELETE_APPROVAL_GROUP_HAS_APPROVAL_EXSITED = 5004,
  APPROVAL_GROUP_NAME_EXSITED = 5005,
  APPROVAL_NODE_EXISTED = 5006,
  APPROVAL_NODE_NOT_FOUND = 5007,
  APPROVAL_LINE_EXISTED = 5008,
  APPROVAL_LINE_NOT_FOUND = 5009,

  SELECT_SPECIFIC_LEVEL_FOR_THE_APPROVER = 5010,
  SELECT_GROUP_PERMISSION_FOR_THE_APPROVER = 5011,
  SELECT_USER_WORKSPACE_SPECIFIED_FOR_THE_APPROVAL = 5012,
  SELECT_METHOD_AND_SCOPE_FOR_THE_APPROVER = 5013,
  SELECT_USER_WORKSPACE_SPECIFIED_FOR_THE_APPROVAL_WHEN_APPROVER_IS_EMPTY = 5014,
  ONLY_ONE_APPROVER_SETTING_CAN_BE_CONFIGURED_FOR_SELF_REQUESTER = 5015,
  SELECT_ORGANIZATION_USER_WORKSPACE_FOR_THE_CONDITION_REQUEST = 5016,
  SELECT_LEAVE_TYPE_FOR_THE_CONDITION_LEAVE_TYPE = 5017,
  ADD_VALUE_THE_CONDITION_LEAVE_DURATION = 5018,
  APPROVAL_APPLIED_LEAVE_TYPE_EXISTED = 5019,
  APPROVAL_FLOW_INVALID = 5020,
  CONDITION_GROUP_LIST_CAN_NOT_EMPTY = 5021,
  ONLY_ONE_APPROVER_SETTING_CAN_BE_CONFIGURED_FOR_FORM_CONTACT = 5022,
  CAN_DELETE_APPROVAL_GROUP_SETTING = 5023,
  APPROVAL_NODE_INFO_CAN_NOT_EMPTY = 5024,

  /**
   * * Appliance
   */
  LEAVE_APPLIANCE_NOT_VALID = 5500,
  APPLIANCE_NOT_FOUND = 5501,
  CAN_NOT_CHANGE_STATUS_OF_APPLIANCE_STEP = 5502,
  APPLIANCE_REJECT_REASON_CAN_NOT_EMPTY = 5503,
  ALLOW_MIN_MAX_APPLIANCE = 5504,
  USER_WORKSPACE_LEAVE_BALANCE_NOT_ENOUGH = 5505,
  NOT_DELETE_CHANGE_SHIFT_APPLIANCE_PAST = 5506,
  NOT_CHANGE_STATUS_APPLIANCE_NOT_PENDING = 5507,
  USER_WORKSPACE_APPLIANCE_NOT_FOUND = 5508,
  CANNOT_REMOVE_CHANGE_SHIFT_APPLIANCE = 5509,
  REACH_LIMIT_CLAIM_APPLIANCE_PER_MONTH = 5510,
  ONLY_CAN_SUBMIT_CLAIM_APPLIANCE_WITHIN_DAY = 5511,
  ONLY_CAN_SUBMIT_REQUEST_BEFORE_APPLIED_APPLIANCE_DAY = 5512,
  APPLIANCE_TYPE_NOT_FOUND = 5513,
  APPLIANCE_CAN_NOT_REVOKE = 5514,
  APPLIANCE_NOT_VALID = 5515,
  APPLIANCE_REVOKE_NOT_FOUND = 5516,
  CHANGE_SHIFT_APPLIANCES_NOT_FOUND = 5517,
  REGISTER_SHIFT_APPLIANCES_NOT_FOUND = 5518,
  ROTATE_SHIFT_APPLIANCES_NOT_FOUND = 5519,
  CLAIM_WORKING_DAY_APPLIANCES_NOT_FOUND = 5520,
  CLAIM_APPLIANCE_INVALID = 5521,
  CANNOT_REMOVE_CLAIM_WORKING_DAY_APPLIANCE_IN_THE_PAST = 5522,
  NOT_ALLOW_REGISTER_SHIFT = 5523,
  ONLY_CAN_SUBMIT_CLAIM_APPLIANCE_FOR_PAST_DAY = 5524,
  CAN_NOT_REVOKE_REJECTED_REVOKE_APPLIANCE = 5525,
  CANNOT_CHANGE_APPLIANCE_IN_REVOKE_PROCESS = 5526,
  CLAIM_APPLIANCE_DATE_INVALID = 5527,
  CLAIM_APPLIANCE_EXISTED = 5528,
  NOT_SUPPORT_METHOD_CHECKIN_APPLIANCE = 5529,
  LEAVE_BALANCE_NOT_ENOUGH_TO_APPROVE = 5530,
  CANNOT_CLAIM_FULL_WORKING_DAY = 5531,
  CANNOT_CLAIM_UNFINISHED_DAY = 5532,
  USER_WORKSPACE_LEAVE_BALANCE_EXPIRED = 5533,
  CANNOT_CLAIM_IN_DAY_WITHOUT_SHIFT = 5534,
  CANNOT_CLAIM_IN_DAY_FUTURE = 5535,
  CANNOT_CLAIM_WORKING_DAY = 5536,

  /**
   * * day off
   */

  DAY_OFF_NOT_FOUND = 5101,
  DAY_OFF_EXISTED_IN_GROUP = 5102,
  HOLIDAY_ALREADY_EXISTED = 5103,
  LOOP_CONFIG_ERROR = 5104,
  CAN_NOT_DELETE_DAY_OFF_PASSED = 5105,
  FORMAT_YEAR_INVALID = 5105,
  CAN_NOT_UPDATE_PASSED_HOLIDAY = 5106,
  DAY_OFF_LESS_THAN_NOW = 5107,
  DAY_OFF_GROUP_NOT_EXISTED = 5108,

  /**
   * * Countries
   */
  COUNTRY_NOT_FOUND = 6000,
  CITY_NOT_FOUND = 6001,
  DISTRICT_NOT_FOUND = 6002,
  WARD_NOT_FOUND = 6003,
  REGION_NOT_FOUND = 6004,

  /**
   * * Checkin methods
   */
  MACHINE_IS_EXISTED = 6500,
  MACHINE_NOT_FOUND = 6501,
  OFFICE_WIFI_CAN_NOT_EMPTY = 6502,
  OFFICE_LOCATION_CAN_NOT_EMPTY = 6503,
  OFFICE_MACHINE_CAN_NOT_EMPTY = 6504,
  WIFI_NOT_NOT_FOUND = 6505,
  LOCATION_NOT_FOUND = 6506,
  QRCODE_LOGIN_MACHINE_INVALID = 6507,
  QRCODE_CHECKIN_MACHINE_INVALID = 6508,
  CHECKIN_INVALID = 6509,
  CANNOT_LOGIN_MACHINE = 6510,
  CHECKIN_LOCATION_INVALID = 6511,
  CHECKIN_WIFI_INVALID = 6512,
  REACH_LIMIT_TRIAL_MACHINE = 6513,
  QRCODE_LOGIN_CMS_INVALID = 6514,
  QRCODE_LOGIN_CMS_EXPIRED = 6515,
  ERROR_CHECKIN_QR_CODE_LOCATION = 6516,
  ERROR_CHECKIN_QR_CODE_NOT_FOUND_LOCATION = 6517,
  ERROR_CHECKIN_QR_CODE_NOT_BELONG_CONTACT = 6518,
  ERROR_CHECKIN_QR_CODE_TIMEOUT = 6519,
  ERROR_CHECKIN_QR_CODE_REFRESH_QR = 6520,
  ERROR_CHECKIN_QR_CODE_NOT_BELONG = 6521,
  ERROR_CHECKIN_QR_CODE_NOT_QR_CODE = 6522,

  /**
   * * Day off groups
   */
  DAY_OFF_GROUP_NOT_FOUND = 7000,
  DAY_OFF_GROUP_HAS_RELATION_INFORMATION = 7001,
  DAY_OFF_GROUP_EXISTED = 7002,
  DAY_OFF_DATE_MUST_EQUAL_LARGER_THAN_NOW = 7003,

  /**
   * * Advance payment config
   */
  ADVANCE_PAYMENT_CONFIG_SCOPES_INVALID = 7100,
  ADVANCE_PAYMENT_CONFIG_NOT_FOUND = 7101,
  ADVANCE_PAYMENT_CONFIG_CODE_EXISTED = 7102,
  ADVANCE_PAYMENT_CONFIG_SCOPE_TYPE_ALL_EXISTED = 7103,
  ADVANCE_PAYMENT_CONFIG_TYPE_PERCENT_CAN_NOT_EMPTY = 7104,
  RANGE_ADVANCE_PAYMENT_CONFIG_CAN_NOT_EMPTY = 7105,
  RANGE_ADVANCE_PAYMENT_CONFIG_NOT_VALID = 7106,
  RANGE_ADVANCE_PAYMENT_CONFIG_DUPLICATED = 7107,
  ADVANCE_APPLIANCE_NOT_FOUND = 7108,
  CANNOT_REMOVE_ADVANCE_APPLIANCE = 7109,
  ADVANCE_APPLIANCE_SUBMISSION_TIME_NOT_VALID = 7110,
  REACH_LIMIT_SUBMISSION_ADVANCE_APPLIANCE = 7111,
  CAN_ONLY_CHOOSE_TRANSFER_TYPE_SALARY_ACCOUNT = 7112,
  REACH_LIMIT_MAXIMUM_ADVANCE_PAYMENT = 7113,
  CANNOT_ADVANCE_PAYMENT = 7114,
  ONLY_CAN_REMOVE_ADVANCE_APPLIANCE_PENDING = 7115,
  CANNOT_CHANGE_ADVANCE_PAYMENT_CONFIG_TYPE = 7116,
  CANNOT_CHANGE_ADVANCE_STATUS_TO_PENDING = 7117,
  CHANGE_ADVANCE_STATUS_NEED_FOLLOW_RULE = 7118,
  ONLY_RECOVERIED_ADVANCE_STATUS_CAN_ADD_RECOVERY_ADVANCE = 7119,
  NEED_TO_ADD_RECOVERY_ADVANCE = 7120,
  RECOVERY_AMOUNT_MUST_LESS_EQUAL_THAN_ADVANCE_AMOUNT = 7121,
  ONLY_CAN_CHANGE_STATUS_MULTIPLE_ADVANCE_APPLIANCE_TO_ADVANCED = 7122,
  CANNOT_CHANGE_ADVANCE_APPLIANCE_STATUS = 7123,
  CANNOT_ADVANCE_PAYMENT_BY_SALARY_ACCOUNT = 7124,

  /**
   * * Overtimes
   */
  OVERTIME_IS_EXISTED = 8000,
  OVERTIME_NOT_FOUND = 8001,
  OVERTIME_SCOPES_INVALID = 8002,
  OVERTIME_RULE_INVALID = 8003,
  CANNOT_REMOVE_OVERTIME_INITIAL_DEFAULT = 8004,
  OVERTIME_APPLIANCE_NOT_FOUND = 8005,
  CANNOT_REMOVE_OVERTIME_APPLIANCE = 8006,
  ALLOW_OVERTIME_AFTER_SHIFT_END_INVALID = 8007,
  ONLY_CHANGE_STATUS_APPROVED_OR_REJECTED = 8008,
  ADMIN_CANNOT_CHANGE_PERMISSION_APPLIANCE_STATUS = 8009,
  CANNOT_SEND_OVERTIME_APPLIANCE_BEFORE_SHIFT_END = 8010,
  OVERTIME_APPLIANCE_IS_EXISTED = 8011,
  OVERTIME_APPLIANCE_LIMITED = 8012,
  OVERTIME_NOT_ALLOW_WORKING_DAY = 8013,
  OVERTIME_NOT_ALLOW_DAY_OFF = 8014,
  OVERTIME_NOT_ALLOW_HOLIDAY = 8015,
  OVERTIME_MIN_REACH_INVALID = 8016,
  CANNOT_SEND_OVERTIME_APPLIANCE_METHOD_AUTO = 8017,
  OVERTIME_CONVERT_TYPE_IS_REQUIRED = 8018,
  NIGHT_SHIFT_OVERTIME_CONVERT_TYPE_IS_REQUIRED = 8019,
  OVERTIME_INFO_NOT_FOUND = 8020,
  DATE_NOT_IN_CURRENT_MONTH = 8021,
  DATE_NOT_HAVE_OVERTIME = 8022,
  DATE_NOT_IN_RANGE = 8023,
  OVERTIME_MUST_LESS_THAN_24_HOUR = 8024,

  /**
   * * In/out rules
   */
  CANNOT_CHECKIN_EARLY = 9000,
  CANNOT_CHECKIN_LATE = 9001,
  CANNOT_CHECKOUT_LATE = 9002,
  CANNOT_CHECKOUT_EARLY = 9003,
  CANNOT_CHECKIN = 9004,

  /**
   * * Other
   */
  TOKEN_INVALID = 10000,
  CACHE_SERVER_NOT_FOUND = 10001,
  MOLECULER_NOT_REGISTER = 10002,
  FILE_IMPORT_FORMAT_INCORRECT = 10003,
  ADMIN_NOT_ENABLE_ACTION_CATEGORY = 10004,
  EXPIRES_DATE_MUST_EQUAL_LARGER_THAN_NOW = 10005,
  EXPIRES_DATE_MUST_EQUAL_LARGER_THAN_VALID_DATE = 10006,

  GOOGLEAPI_EMAIL_NOT_FOUND = 5000,
  GOOGLEAPI_ACCESS_TOKEN_EXPIRED = 5001,
  GOOGLEAPI_CREDIENTIAL_FAILED = 5002,
  FACEBOOK_ACCESS_TOKEN_INVALID = 5003,
  FACEBOOK_EMAIL_NOT_FOUND = 5004,
  APPLE_ACCESS_TOKEN_INVALID = 5005,
  USER_APPLE_ID_NOT_FOUND = 5006,
  USER_FACEBOOK_ID_NOT_FOUND = 5007,
  PERMISSION_MIDDLEWARE_DENIED = 9999,

  /**
   * * 3rd Services
   */
  GEN_STAFF_TOKEN_ERROR = 12500,
  GEN_HALF_USER_TOKEN_ERROR = 12501,
  GET_USER_BY_PHONE_NUMBER_ERROR = 12502,
  GET_USER_BY_ID_ERROR = 12503,
  CREATE_USER_BY_USER_INFO_ERROR = 12504,
  CHECK_EXIST_ACCOUNT_ERROR = 12505,
  RESET_PASSWORD_BY_ACCOUNT_ID_ERROR = 12506,
  LOGIN_BY_ACCOUNT_ID_ERROR = 12507,
  VERIFY_USER_TOKEN_ERROR = 12508,
  VERIFY_HALF_USER_TOKEN_ERROR = 12509,
  LOGIN_BY_OAUTH_2_ERROR = 12510,
  SEND_MESSAGE_TO_MULTI_DEVICE_ERROR = 12511,
  SEND_EMAIL_ERROR = 12512,
  CHANGE_PASSWORD_ERROR = 12513,
  CHECK_SUBSCRIPTION_ERROR = 12514,
  GET_SUBSCRIPTIONS_ERROR = 12515,
  DISABLE_SUBSCRIPTION_WARNING_ERROR = 12516,
  UPDATE_ID_SERVICE_USER = 12518,
  GEN_STAFF_APP_TOKEN_ERROR = 12517,
  REQUEST_SUBSCRIPTION_ERROR = 12519,
  GET_SUBSCRIPTION_FEATURES_ERROR = 12520,
  CHECK_WORKSPACE_NAME_ERROR = 12521,
  CREATE_DEFAULT_SUBSCRIPTION_WARNING_ERROR = 12522,
  REMOVE_ID_SERVICE_USER = 12523,
  UPLOAD_FACE_CHECKIN_ERROR = 12524,
  HANDLE_USER_WORKSPACE_PROJECT_MISS_LOG_ERROR = 12525,
  RENEW_USER_TOKEN = 12526,
  GENERATE_SALARY_DEFAULT_DATA = 12527,
  EXPIRE_SALARY_INFORMATION = 12528,
  UPDATE_SALARY_INFORMATION_END_DATE = 12529,
  GET_SALARY_PERIOD_OF_DATE = 12530,

  /**
   * * Fixed case force logout. Do not modify
   */
  FORCE_LOGOUT = 40300,
  WORKSPACE_PACKAGE_EXPIRED = 40301,
  CHECK_PASSWORD_IS_REQUIRED = 40302,
  USER_ACCESS_TOKEN_EXPIRED = 40303,

  /**
   * * For case display popup has relation information. Do not modify
   */
  HAS_RELATION_INFORMATION = 75000,
  REPLACE_SALARY_ACCOUNT = 75001,

  /**
   * Remote Working
   */
  REMOTE_WORKING_APPLIANCE_NOT_FOUND = 13000,
  CANNOT_DELETE_REMOTE_WORKING_APPLIANCE_IN_THE_PAST = 13001,
  NOT_FOUND_SHIFT_INVALID_REMOTE_WORKING = 13002,
  REMOTE_WORKING_APPLIANCE_REQUIRE_IMAGE = 13003,
  REMOTE_WORKING_APPLIANCE_REQUIRE_LOCATION = 13004,

  /**
   * Office
   */
  OFFICE_IS_EXISTED = 14000,
  OFFICE_NOT_FOUND = 14001,
  OFFICE_IS_IN_SHIFT_GROUP = 14002,
  NO_OFFICE_LOCATION = 14003,
  NO_OFFICE_WIFI = 14004,
  NO_OFFICE_MACHINE = 14005,
  MACHINE_BELONG_TO_ANOTHER_OFFICE = 14006,
  MACHINE_NOT_FOUND_IN_OFFICE = 14007,
  MACHINE_HASH_INVALID = 14008,
  OFFICE_FLOOR_NOT_FOUND = 14009,
  OFFICE_QRCODE_INVALID = 14010,

  /**
   * Salary
   */
  SALARY_GRADE_IS_EXISTED = 15000,
  SALARY_GRADE_NOT_FOUND = 15001,
  CAN_NOT_DELETE_OR_INACTIVE_SALARY_GRADE = 15002,
  CAN_NOT_INACTIVE_SALARY_GRADE = 15003,

  SALARY_RANK_IS_EXISTED = 15100,
  SALARY_RANK_NOT_FOUND = 15101,
  CAN_NOT_DELETE_SALARY_RANK = 15102,
  CAN_NOT_CHANGE_STATUS_SALARY_RANK = 15103,
  SALARY_RANK_IS_IN_USER_WORKSPACE_LABOR_CONTRACT = 15104,
  SALARY_RANK_IS_IN_SALARY_INFORMATION = 15105,
  CANNOT_UPDATE_SALARY_RANK_COEFFICIENT = 15106,
  CANNOT_UPDATE_SALARY_RANK_STATUS = 15107,

  SALARY_PERIOD_NOT_FOUND = 16000,
  SALARY_PERIOD_IS_EXISTED = 16001,
  SALARY_PERIOD_LOOP_FROM_DATE_INVALID = 16002,
  SALARY_PERIOD_DATE_INVALID = 16003,
  CAN_NOT_UPDATE_SALARY_PERIOD_IN_PAST = 16005,
  CAN_NOT_REMOVE_SALARY_PERIOD_IN_PAST = 16006,

  SALARY_PARAMETER_NOT_FOUND = 17000,
  SALARY_PARAMETER_CODE_EXISTED = 17001,
  REMOVE_SALARY_PARAMETER_EXISTED_MINIMUM_AMOUNT = 17002, // Fixed for FE
  CHANGE_ACTIVE_TO_INACTIVE_SALARY_PARAMETER = 17003, // Fixed for FE
  CHANGE_INACTIVE_TO_ACTIVE_SALARY_PARAMETER = 17004, // Fixed for FE
  CAN_NOT_REMOVE_SALARY_PARAMETER_EXISTED_MINIMUM_AMOUNT = 17005,

  SALARY_INFORMATION_NOT_FOUND = 18000,
  CANNOT_UPDATE_SALARY_INFORMATION_EXPIRE = 18001,
  ONLY_UPDATE_SALARY_INFORMATION_STATUS = 18002,
  CANNOT_UPDATE_SALARY_INFORMATION_IN_PAST = 18003,
  CANNOT_UPDATE_SALARY_INFORMATION = 18004,
  CANNOT_REMOVE_SALARY_INFORMATION = 18005,
  INVALID_SALARY_INFORMATION_START_DATE = 18006,

  /**
   * Report
   */
  REPORT_NOT_FOUND = 20000,
  REPORT_IS_EXISTED = 20001,
  REPORT_HISTORY_NOT_FOUND = 20002,
  ONLY_EXPORT_REPORT_TYPE_DEFAULT = 20003,
  REPORT_FILE_INVALID = 20004,
  INVALID_EXPORT_ATTRIBUTE = 20005,
  DUPLICATE_INFORMATION_SIGN_CODE = 20006,

  UTILITIES_NOT_FOUND = 21000,

  START_DATE_CANNOT_BE_IN_THE_PAST = 21100,
  REIMBURSEMENT_NOT_FOUND = 21101,
  CANNOT_UPDATE_REIMBURSEMENT_IN_THE_PAST = 21102,
  CANNOT_DELETE_REIMBURSEMENT_IN_THE_PAST = 21103,

  PAYROLL_POLICY_EXISTED = 21200,
  PAYROLL_POLICY_NOT_FOUND = 21202,
  PAYROLL_POLICY_IS_IN_CONTRACT = 21203,
  PAYROLL_POLICY_IS_INACTIVE = 21204,

  CANNOT_DELETE_SALARY_INFORMATION_IN_THE_PAST = 21301,
  CANNOT_CREATE_SALARY_INFORMATION_IN_THE_PAST = 21302,
  INVALID_SALARY_METHOD_CONFIG = 21303,
  SALARY_CURRENT_IS_REQUIRED = 21304,

  PAYROLL_ELEMENT_NOT_FOUND = 21400,
  CANNOT_DELETE_PAYROLL_ELEMENT = 21401,
  PAYROLL_ELEMENT_EXISTED = 21402,
  CANNOT_UPDATE_PAYROLL_ELEMENT_CODE = 21403,

  PAYROLL_TABLE_NOT_FOUND = 21500,
  PAYROLL_TABLE_REQUIRE_USER_WORKSPACE_OR_ORGANIZATION = 21501,
  CANNOT_UPDATE_PAYROLL_TABLE = 21502,
  CANNOT_DELETE_PAYROLL_TABLE = 21503,
  SALARY_PERIOD_CANNOT_BE_IN_THE_FUTURE = 21504,
  PAYSLIP_NOT_FOUND = 21506,
  CANNOT_LOCK_PAYROLL_TABLE = 21507,
  CANNOT_SEND_PAYSLIP = 21508,
  PAYROLL_TABLE_HISTORY_NOT_FOUND = 21509,
  PERMISSION_LOCK_PAYROLL_TABLE_DENIED = 21510,
  INSUFFICIENT_PERMISSION = 21511,
  USER_WORKSPACE_INVALID_BY_SIGN_COMPANY = 21512,

  ELEMENT_LIBRARY_EXISTED = 21600,

  REPORT_IS_PENDING = 21601,
  /**
   * Workplace
   */
  WORKPLACE_POST_NOT_FOUND = 22000,
  WORKPLACE_CONFIG_NOT_FOUND = 22001,
  WORKPLACE_POST_CAN_NOT_EDIT = 22002,
  WORKPLACE_POST_CAN_NOT_REACTION = 22003,
  WORKPLACE_POST_CAN_NOT_COMMENT = 22004,

  /**
   * Formulas
   */
  FORMULAS_INVALID = 23001,

  CANNOT_RESEND_OTP = 24000,
  OTP_NOT_FOUND = 24001,
  OPT_EXPIRED = 24002,
  OTP_VERIFY_TOKEN_EXPIRED = 24003,
  CANNOT_SEND_OTP = 24004,
  OTP_VERIFY_TOKEN_IS_REQUIRED = 24005,
  INVALID_OTP = 24006,
  CAN_ONLY_REGISTER_ACCOUNT_BY_EMAIL_OR_PHONE_NUMBER = 24007,

  /**
   * Webhook
   */
  WEBHOOK_IS_EXIST = 25001,
  WEBHOOK_NOT_FOUND = 25002,

  /**
   * User Link Account
   */
  USER_LINK_ACCOUNT_EXISTED = 25100,
  USER_LINK_ACCOUNT_NOT_FOUND = 25101,
  CANNOT_UNLINK_ACCOUNT = 25102,
  INVALID_SEARCH_LINK_ACCOUNT = 25103,
  PASSWORD_IS_REQUIRED = 25104,
  INVALID_LINK_ACCOUNT_UPDATE_DATA = 25105,
  INVALID_EMAIL = 25106,
  INVALID_PHONE_NUMBER = 25107,
  CANNOT_LINK_ACCOUNT = 25108,
  USER_ACCOUNT_HAS_NO_PASSWORD = 25109,

  /*
   * * Special Speak checkin
   */
  SPEAK_CHECKIN_NOT_FOUND = 26000,
  SPEAK_CHECKIN_EXISTED = 26002,
  SPEAK_CHECKIN_SCOPES_INVALID = 26003,

  CAN_NOT_REMOVE_SYSTEM_CATEGORY_HAS_RELATION_DATA = 27000,
  CAN_NOT_INACTIVE_SYSTEM_CATEGORY_HAS_RELATION_DATA = 27001,

  /* Company */
  COMPANY_CODE_EXISTED = 28000,
  COMPANY_NOT_FOUND = 28001,
  CAN_NOT_REMOVE_COMPANY_HAS_LABOR_CONTRACT = 28002,

  /**
   * Users
   */
  CAN_NOT_REMOVE_ACCOUNT_BECAUSE_HAVE_WORKPSPACE_NOT_SUPER_ADMIN = 29001,
  CAN_NOT_SETUP_REMOVE_ACCOUNT = 29002,
  CAN_NOT_REMOVE_ACCOUNT_BECAUSE_OWNER_WORKSPACE = 29003,

  /**
   * Checkin config
   */
  CHECKIN_CONFIG_NIGHT_SHIFT_HOUR_INVALID = 30000,

  /**
   * Workspace Config
   * */

  WORKSPACE_CONFIG_NOT_FOUND = 31000,

  /**
   * User workspace device
   * */

  USER_WORKSPACE_DEVICE_NOT_FOUND = 32000,
  LIMIT_DEVICE_LOGIN = 32001,
  LIMIT_ACCOUNT_LOGIN = 32002,
  DEVICE_CENSORED = 32003,
  ACCOUNT_CENSORED = 32004,
  INVALID_LIST_UPDATE = 32005,
  INVALID_STATUS = 32006,
  DEVICE_NOT_FOUND = 32007,
  /**
   * Human report
   */
  HUMAN_REPORT_NOT_FOUND = 40001,
  HUMAN_REPORT_EXPORT_LIMIT = 40002,
}

export default ERROR;
