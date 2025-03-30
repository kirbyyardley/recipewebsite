"use client";
import { Sheet } from "@silk-hq/components";
import "./PageFromBottom.css";

const PageFromBottom = () => (
   <Sheet.Root license="commercial">
      <Sheet.Trigger className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">page from bottom</Sheet.Trigger>
      <Sheet.Portal>
         <Sheet.View
            className="PageFromBottom-view"
            contentPlacement="bottom"
            swipe={false}
            nativeEdgeSwipePrevention={true}
         >
            <Sheet.Backdrop className="PageFromBottom-backdrop" travelAnimation={{ opacity: [0, 0.1] }} />
            <Sheet.Content className="PageFromBottom-content">
               <div className="PageFromBottom-topBar">
                  <Sheet.Trigger className="PageFromBottom-dismissTrigger" action="dismiss">
                     Close
                  </Sheet.Trigger>
               </div>
               <div className="p-6 space-y-4 text-gray-900">
                  <h2 className="text-xl font-semibold text-black">Page from Bottom Example</h2>
                  <p className="text-gray-700">This is a page that slides in from the bottom of the screen.</p>
                  <p className="text-gray-700">It takes up the full height of the viewport.</p>
               </div>
            </Sheet.Content>
         </Sheet.View>
      </Sheet.Portal>
   </Sheet.Root>
);

export { PageFromBottom }; 