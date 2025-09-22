import { StoreManagement } from '../components/StoreManagement';

export function meta() {
  return [
    { title: "My Stores - Quantify Rating" },
    { name: "description", content: "Manage your store profiles and information" },
  ];
}

export default function Stores() {
  return <StoreManagement />;
}
