// import { readFileSync } from 'fs';
// import * as yaml from 'js-yaml';
// import { join } from 'path';

// const YAML_CONFIG_FILENAME = 'config.yaml';

export type Configuration = ReturnType<typeof configuration>;

export default function configuration() {
  // return yaml.load(
  //   readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8'),
  // ) as Record<string, any>;

  const {
    PORT,
    HOST,
    ATHORIZATION_TOKEN,
    DEV_MODE,
    LOCATION_NAME,
    PG,
    VIRTUAL_ACCOUNT_URL,
    PAYMENT_CLIENT_KEY,
    PAYMENT_SECRET_KEY,
    BANK,
    BANK_CODE,
    KAKAO_REST_API_KEY,
    BOT_ID,
    EVENT_API_URL,
    TEST_APP_USER_ID,
    SIGNUP_BLOCK_ID,
    SELECT_TICKET_AND_GET_ALL_ROOMS_BLOCK_ID,
    GET_AVAILABLE_SEATS_BLOCK_ID,
    PAYMENT_FOR_TICKET_BLOCK_ID,
    TICKETING__GET_ALL_ROOMS_BLOCK_ID,
    TICKETING__GET_AVAILABLE_SEATS_BLOCK_ID,
    TICKETING__CONFIRM_TICKET_PURCHASE_INFO_BLOCK_ID,
    GET_AVAILABLE_MY_TICKETS_BLOCK_ID,
    CHECK_IN__GET_ALL_ROOMS_BLOCK_ID,
    CHECK_IN__GET_AVAILABLE_SEATS_IN_ROOM_BLOCK_ID,
    CHECK_IN_BLOCK_ID,
  } = process.env;

  [
    PORT,
    HOST,
    ATHORIZATION_TOKEN,
    DEV_MODE,
    LOCATION_NAME,
    PG,
    VIRTUAL_ACCOUNT_URL,
    PAYMENT_CLIENT_KEY,
    PAYMENT_SECRET_KEY,
    BANK,
    BANK_CODE,
    KAKAO_REST_API_KEY,
    BOT_ID,
    EVENT_API_URL,
    TEST_APP_USER_ID,
    SIGNUP_BLOCK_ID,
    SELECT_TICKET_AND_GET_ALL_ROOMS_BLOCK_ID,
    GET_AVAILABLE_SEATS_BLOCK_ID,
    PAYMENT_FOR_TICKET_BLOCK_ID,
    TICKETING__GET_ALL_ROOMS_BLOCK_ID,
    TICKETING__GET_AVAILABLE_SEATS_BLOCK_ID,
    TICKETING__CONFIRM_TICKET_PURCHASE_INFO_BLOCK_ID,
    GET_AVAILABLE_MY_TICKETS_BLOCK_ID,
    CHECK_IN__GET_ALL_ROOMS_BLOCK_ID,
    CHECK_IN__GET_AVAILABLE_SEATS_IN_ROOM_BLOCK_ID,
    CHECK_IN_BLOCK_ID,
  ].forEach(
    (env, i) => env === undefined && new Error(`index(${i}) env is undefined`),
  );

  return {
    mode: process.env.NODE_ENV,
    port: PORT ? parseInt(PORT) : 3000,
    host: HOST,
    athorizationToken: ATHORIZATION_TOKEN,
    devMode: DEV_MODE === 'true' ? true : false,
    location: LOCATION_NAME,
    pg: {
      name: PG,
      virtualAccountUrl: VIRTUAL_ACCOUNT_URL,
      paymentClientKey: PAYMENT_CLIENT_KEY,
      paymentSecretKey: PAYMENT_SECRET_KEY,
      bank: BANK,
      bankCode: BANK_CODE,
    },
    kakao: {
      restApiKey: KAKAO_REST_API_KEY,
      botId: BOT_ID,
      eventApiUrl: EVENT_API_URL,
      blockIds: {
        signup: SIGNUP_BLOCK_ID,
        selectTicketAndGetAllRooms: SELECT_TICKET_AND_GET_ALL_ROOMS_BLOCK_ID,
        getAvailableSeats: GET_AVAILABLE_SEATS_BLOCK_ID,
        paymentForTicket: PAYMENT_FOR_TICKET_BLOCK_ID,
        // new version
        ticketing: {
          getAvailableSeatsInRoom: GET_AVAILABLE_SEATS_BLOCK_ID,
          getAllRooms: TICKETING__GET_ALL_ROOMS_BLOCK_ID,
          confirmTicketPurchaseInfo:
            TICKETING__CONFIRM_TICKET_PURCHASE_INFO_BLOCK_ID,
        },
        checkInOut: {
          getAvailableMyTickets: GET_AVAILABLE_MY_TICKETS_BLOCK_ID,
          getAllRooms: CHECK_IN__GET_ALL_ROOMS_BLOCK_ID,
          getAvailableSeatsInRoom:
            CHECK_IN__GET_AVAILABLE_SEATS_IN_ROOM_BLOCK_ID,
          checkIn: CHECK_IN_BLOCK_ID,
        },
      },
      test: {
        appUserId: TEST_APP_USER_ID,
      },
    },
  };
}
