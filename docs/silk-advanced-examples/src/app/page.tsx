"use client";
import React, { useState, useRef } from "react";
import { Fixed, Island, Scroll } from "@silk-hq/components";

import "./page.css";
import { ExampleBottomSheet } from "@/components/examples/BottomSheet/ExampleBottomSheet";
import { ExampleToast } from "@/components/examples/Toast/ExampleToast";
import { ExampleSheetWithKeyboard } from "@/components/examples/SheetWithKeyboard/ExampleSheetWithKeyboard";
import { ExampleSheetWithDetent } from "@/components/examples/SheetWithDetent/ExampleSheetWithDetent";
import { ExampleDetachedSheet } from "@/components/examples/DetachedSheet/ExampleDetachedSheet";
import { ExampleTopSheet } from "@/components/examples/TopSheet/ExampleTopSheet";
import { ExampleLongSheet } from "@/components/examples/LongSheet/ExampleLongSheet";
import { ExamplePage } from "@/components/examples/Page/ExamplePage";
import { ExamplePageFromBottom } from "@/components/examples/PageFromBottom/ExamplePageFromBottom";
import {
  ExampleParallaxPageStack,
  ExampleParallaxPageStackOutlet,
  ExampleParallaxPageStackMenuItem,
  ExampleParallaxPage,
} from "@/components/examples/ParallaxPage/ExampleParallaxPage";
import { ExampleLightbox } from "@/components/examples/Lightbox/ExampleLightbox";
import { ExampleSheetWithDepthData } from "@/components/examples/SheetWithDepth/ExampleSheetWithDepthData";
import {
  ExampleSheetWithDepthStack,
  ExampleSheetWithDepthStackScenery,
  ExampleSheetWithDepthStackBackground,
  ExampleSheetWithDepthStackFirstSheetBackdrop,
  ExampleSheetWithDepth,
} from "@/components/examples/SheetWithDepth/ExampleSheetWithDepth";
import { ExampleSheetWithStackingData } from "@/components/examples/SheetWithStacking/ExampleSheetWithStackingData";
import { ExampleSheetWithStacking } from "@/components/examples/SheetWithStacking/ExampleSheetWithStacking";
import { ExampleSidebar } from "@/components/examples/Sidebar/ExampleSidebar";
import { ExampleParallaxPageData } from "@/components/examples/ParallaxPage/ExampleParallaxPageData";
import { ExamplePersistentSheetWithDetent } from "@/components/examples/PersistentSheetWithDetent/ExamplePersistentSheetWithDetent";
import { ExampleCard } from "@/components/examples/Card/ExampleCard";

import { ParallaxPageExampleStackId } from "@/components/examples/_global";

export default function Home() {
  const pageContainerRef = useRef(null);
  const [menuLeftContainer, setMenuLeftContainer] = useState(null);
  const [menuTitleContainer, setMenuTitleContainer] = useState(null);

  return (
    <React.StrictMode>
      <body className="Home-root">
        <ExampleSheetWithDepthStack>
          <ExampleSheetWithDepthStackBackground />
          <ExampleSheetWithDepthStackScenery>
            <main className="Home-main" ref={pageContainerRef}>
              <ExampleParallaxPageStack
                stackId={ParallaxPageExampleStackId}
                pageContainer={pageContainerRef.current}
                menuTitleContainer={menuTitleContainer}
                menuLeftContainer={menuLeftContainer}
              >
                <ExampleParallaxPageStackOutlet>
                  <Scroll.Root asChild>
                    <Scroll.View
                      className="Home-scrollContainer"
                      pageScroll={true}
                      nativePageScrollReplacement="auto"
                      safeArea="none"
                    >
                      <Scroll.Content className="Home-examples">
                        <ExampleBottomSheet />
                        <ExampleTopSheet />
                        <ExampleDetachedSheet />
                        <ExampleCard />
                        <ExampleSidebar />
                        <ExampleToast />
                        <ExampleSheetWithStacking
                          data={ExampleSheetWithStackingData}
                        />
                        <ExamplePersistentSheetWithDetent />
                        <ExampleSheetWithDetent />
                        <ExampleSheetWithDepth
                          data={ExampleSheetWithDepthData}
                        />
                        <ExampleSheetWithKeyboard />
                        <ExampleLightbox />
                        <ExampleParallaxPage data={ExampleParallaxPageData} />
                        <ExampleLongSheet />
                        <ExamplePage />
                        <ExamplePageFromBottom />
                      </Scroll.Content>
                    </Scroll.View>
                  </Scroll.Root>
                </ExampleParallaxPageStackOutlet>
                <Fixed.Root asChild className="Home-topBar">
                  <Island.Root forComponent={ParallaxPageExampleStackId}>
                    <Fixed.Content asChild>
                      <Island.Content className="Home-topBarContent">
                        <div
                          className="Home-topBarMenuLeftContainer"
                          ref={
                            setMenuLeftContainer as unknown as React.RefObject<any>
                          }
                        />
                        <div
                          className="Home-topBarMenuTitleContainer"
                          ref={
                            setMenuTitleContainer as unknown as React.RefObject<any>
                          }
                        >
                          <ExampleParallaxPageStackMenuItem>
                            Silk
                          </ExampleParallaxPageStackMenuItem>
                        </div>
                      </Island.Content>
                    </Fixed.Content>
                  </Island.Root>
                </Fixed.Root>
              </ExampleParallaxPageStack>
              <ExampleSheetWithDepthStackFirstSheetBackdrop />
            </main>
          </ExampleSheetWithDepthStackScenery>
        </ExampleSheetWithDepthStack>
      </body>
    </React.StrictMode>
  );
}
