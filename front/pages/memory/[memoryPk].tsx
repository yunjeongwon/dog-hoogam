import { useRouter } from "next/router";
// import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./[memoryPk].module.scss";
// import testimg from "../../public/images/test.png";
import getOneFeed from "../api/feed/getOneFeed";

function Detail() {
  const [feed, setFeed] = useState({});
  const router = useRouter();
  const Id = router.query.memoryPk;
  console.log(Id);

  useEffect(() => {
    getOneFeed(Id)
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data, "하나?");
          setFeed(res.data);
        }
        return [];
      })
      .catch((err) => {
        console.log(err);
      });
  }, [Id]);
  // const dummy = {
  //   id: Id,
  //   img: testimg,
  //   content: "테스트 문구입니다.",
  //   time: "2022년 10월 27일"
  // };
  return (
    <div className={`${styles.wrapper}`}>
      <h1 className={`${styles.Nav} fs-20 notoBold`}>추억 남기기</h1>
      <div className={`${styles.detail}`}>
        <div className={`${styles.imgBox}`}>
          <img className={`${styles.img}`} src={feed.feedImg} alt="#" />
        </div>

        <h1 className={`${styles.content} fs-22 notoBold`}>{feed.content}</h1>
        <h1 className={`${styles.time} fs-16 notoBold`}>{feed.createDate}</h1>
      </div>
    </div>
  );
}

export default Detail;
