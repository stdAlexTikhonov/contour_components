import { Dashboard, Metadata } from "../../types/actions";

export interface Props {
  dashboard: Dashboard | null;
  metadata: Array<Metadata> | null;
  handleViews: any;
}

export type IProps = Props;
