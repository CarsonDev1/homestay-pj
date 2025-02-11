import { combineReducers } from "redux";
import homeReducer, { HomeState } from "../../modules/Home/Home.Reducer";
import adminReducer, { AdminState } from "../../modules/Admin/Admin.Reducer";
import partnerReducer, {
  PartnerState,
} from "../../modules/Partner/Partner.Reducer";

const rootReducer = combineReducers({
  home: homeReducer,
  partner: partnerReducer,
  admin: adminReducer,
});

export default rootReducer;

export const RootState = {
  home: HomeState,
  partner: PartnerState,
  admin: AdminState,
};
