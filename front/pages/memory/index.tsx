import Link from "next/link";
import Image from "next/image";
// import { useEffect, useState } from "react";
// import getFeed from "../api/feed/getFeed";
// import axios from "axios";
import styles from "./index.module.scss";
import createlogo from "../../public/icons/create.svg";
import MemoryList from "../../components/memory/MemoryList";

function Index() {
  return (
    <div className={`${styles.wrapper}`}>
      <div className={`${styles.memoryNav} flex justify-space-between`}>
        <h1 className="fs-20 notoBold">추억 남기기</h1>
        <Link href="/memory/create">
          <div className={`${styles.createBtn}`}>
            <Image src={createlogo} alt="#" />
          </div>
        </Link>
      </div>
      <MemoryList />
    </div>
  );
}

export default Index;
