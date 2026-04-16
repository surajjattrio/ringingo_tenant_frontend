// PROJECT IMPORTS
import Icon from "@/components/ui-components/Icon";

// TYPES
interface NotificationPopupProps {
  visible?: boolean;
  className?: any;
  onClick?: any;
}

// MOCK DATA
const notificationList = [
  {
    name: "Lorem ipsum dolor",
    time: "10 mins ago",
    icon: "ArchiveBook",
  },
  {
    name: "Lorem ipsum dolor",
    time: "10 mins ago",
    icon: "DocumentText",
  },
  {
    name: "Lorem ipsum dolor",
    time: "10 mins ago",
    icon: "TaskSquare",
  },
];

/* ============================== NOTIFICATION POPUP ============================== */

const NotificationPopup = (props: NotificationPopupProps) => {
  const { className, visible = false, onClick } = props;

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-50 px-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[100%] max-h-full bg-transparent ${
          !visible && "hidden"
        }`}
        onClick={onClick}
      >
        <div className="w-full h-full relative flex justify-center">
          <div
            onClick={(e) => e.stopPropagation()}
            className={`${className} w-[278px] bg-white rounded-xl pb-6 drop-shadow-xl ${
              !visible && "hidden"
            }`}
          >
            <div className="bg-secondary py-2 px-4 rounded-t-xl flex justify-between items-center">
              <p className="text-xs font-bold text-white">Notifications</p>
              <p className="text-xs font-noraml text-white">Mark all as read</p>
            </div>
            <div className="pt-3 pb-7">
              {notificationList.map((val: any, index: number) => (
                <div key={index} className="flex items-center mb-2 px-1">
                  <div className="pl-6 pr-2">
                    <Icon name={val.icon} width={34} height={34} alt="Icon" />
                  </div>
                  <div className="w-[170px]">
                    <p className="text-xs font-bold">{val.name}</p>
                    <p className="text-xs font-normal">{val.time}</p>
                  </div>
                  <div className="pl-2 pr-3">
                    <Icon
                      className="cursor-pointer"
                      name="CloseCircle"
                      width={16}
                      height={16}
                      alt="closeCircle"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center py-2 border-dark-700 border-t">
              <p className="text-xs font-normal text-primary mr-1">View All</p>
              <Icon
                tooltip="view all"
                className="cursor-pointer"
                name="ArrowRightGreen"
                width={16}
                height={16}
                alt="arrowIcon"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationPopup;
