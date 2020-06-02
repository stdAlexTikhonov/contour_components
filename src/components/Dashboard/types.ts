import { Dashboard, Metadata } from "../../types/actions";

export interface Props {
  dashboard: Dashboard | null;
  metadata: Array<Metadata> | null;
}

export type IProps = Props;
