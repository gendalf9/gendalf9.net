import React from 'react';
import Giscus from "@giscus/react";
import { useColorMode } from '@docusaurus/theme-common';

export default function GiscusComponent() {
  const { colorMode } = useColorMode();

  return (
    <Giscus    
      repo="gendalf9/gendalf9.net"
      repoId="R_kgDOI2EQdw"
      category="Docusaurus"
      categoryId="DIC_kwDOI2EQd84CT_wK"  // E.g. id of "General"
      mapping="url"                        // Important! To map comments to URL
      strict="0"
      reactionsEnabled="1"
      emitMetadata="1"
      inputPosition="top"
      theme={colorMode}
      lang="ko"
      loading="lazy"
      crossorigin="anonymous"
      async
    />
  );
}