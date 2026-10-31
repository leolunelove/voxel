export const SPAWN=[0,2.5,11.8];
export const WALK_ROUTE=[[0,11.8],[0,6.6],[5.3,6.6],[5.3,-7],[4,-13],[4,-21.2]];
export const BUS_BOUNDS=[-3,3,5,17.2];
export function groundHeight(x,z){if(x>=-3.05&&x<=3.05&&z>=5&&z<=17.2)return .85;if(z>5.15&&z<7.85){if(x>=3&&x<3.7)return .64;if(x>=3.7&&x<4.4)return .4;if(x>=4.4&&x<5.1)return .18;}return 0;}
export const inPreview=(x,z)=>x>-13.5&&x<19.5&&z>-27&&z<22;
export const inBus=p=>p.x>-3&&p.x<3.5&&p.z>5&&p.z<17.3;
export const atReception=p=>Math.hypot(p.x-4,p.z+21.6)<2.7;
