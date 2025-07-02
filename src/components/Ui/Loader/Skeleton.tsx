import { Skeleton } from "primereact/skeleton";

function SkeletonLoader() {
  const items = Array.from({ length: 2 }, (_, i) => i);

  return (
    <div>
      <div className="kanban-wrapper">
        {items.map((item) => (
          <div key={item}>
            <div className="flex gap-2 items-center mb-3">
              <Skeleton shape="circle" size="1.3rem"></Skeleton>
              <Skeleton width="6rem" height="1.3rem"></Skeleton>
            </div>
            <div className="board-wrapper">
              {items.map((item) => (
                <div
                  key={item}
                  className="mx-[1px] mb-5 shadow-[0_4px_6px_rgba(54,78,126,.102)]"
                >
                  <Skeleton
                    width="17.35rem"
                    height="5.8rem"
                    borderRadius="8px"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div>
          <p className="mb-0.5">&nbsp;</p>
          <div className="relative">
            <Skeleton width="18rem" height="83vh" borderRadius="6px" />
            <div className="flex items-center gap-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Skeleton width="1.5rem" height="1.5rem" borderRadius="6px" />
              <Skeleton width="6rem" height="1.5rem" borderRadius="6px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonLoader;
