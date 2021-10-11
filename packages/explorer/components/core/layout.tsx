import React, { FC } from "react";
import { Nav } from "./navigation";
import Link from "next/link";
import { EnvuseBrand } from "../brand/envuse-brand";


export const Layout: FC = ({ children }) => <div className="container mx-auto pt-4">
  <Nav selected="overview">
    {/* <Nav.Item>
      <EnvuseBrand size="@90w"></EnvuseBrand>
    </Nav.Item> */}

    <Nav.ItemLi keyItem="overview"><Link href="/"><a>Overview</a></Link></Nav.ItemLi>
    <Nav.ItemLi><Link href="/playground"><a>Playground</a></Link></Nav.ItemLi>
  </Nav>
  {children}
</div>
