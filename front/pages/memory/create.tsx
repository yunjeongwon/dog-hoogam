/* eslint-disable jsx-a11y/label-has-associated-control */
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import styles from "./create.module.scss";
import back from "../../public/icons/back.svg";
import addimg from "../../public/icons/addImg2.png";
import sendFileToIPFS, { getBalance } from "../api/web3/Web3";
import addFeed from "../api/memory/addFeed";
import MyLocation from "../../components/memory/MyLocation";

import { setIsLoading } from "../../redux/slice/calendarSlice";

function Create() {
  const storeUser = useSelector((state: any) => state.user.userInfo);
  const storeLocation = useSelector(
    (state: any) => state.location.locationInfo
  );
  const [userKey, setUserKey] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [uploadimg, setUploadimg] = useState<any>(null);
  const [nftFeed, setNftFeed] = useState({
    content: ""
  });

  const [apiFeed, setApiFeed] = useState<any>({
    content: "",
    feedImg: "",
    lat: "",
    lng: "",
    transactionHash: ""
  });
  const [walletBalance, setWalletBalance] = useState(0);
  const dispatch = useDispatch();
  const router = useRouter();
  const getWalletBalance = async () => {
    const balance = await getBalance(storeUser.userWalletAddress);
    setWalletBalance(balance);
  };

  useEffect(() => {
    if (storeUser.userWalletAddress) {
      getWalletBalance();
    }
  }, []);

  useEffect(() => {
    if (storeLocation) {
      setApiFeed({
        ...apiFeed,
        lat: storeLocation.center.lat,
        lng: storeLocation.center.lng
      });
    }
  }, [storeLocation]);

  useEffect(() => {
    const Token = window.localStorage.getItem("AccessToken");

    axios({
      url: "https://dog-hoogam.site/api/user-service/user/wallet",
      method: "get",
      headers: { Authorization: `Bearer ${Token}` }
    })
      .then((res) => {
        if (res.status === 200) {
          setUserKey(res.data.userPersonalKey);
          return res.data;
        }
        return [];
      })
      .catch((err) => {
        console.log(err);
      });
  });

  function handleImageUpload(e: any) {
    const fileArr = e.target.files;
    setImgFile(e.target.files[0]);
    const file = fileArr[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setUploadimg(reader.result);
    };
  }
  const makeNFT = async (e: any) => {
    if (walletBalance < 100) {
      alert("????????? ???????????????. ???????????? ????????? ???????????????!");
    } else if (nftFeed.content === "") {
      alert("????????? ??????????????????");
    } else if (
      window.confirm(
        "100INK??? ???????????? ????????? ????????????????????????? \n ?????? ??? ?????? 1??? ?????? ?????? ??? ??? ????????????."
      )
    ) {
      try {
        dispatch(setIsLoading(true));
        router.push("/memory");
        const feedNft = await sendFileToIPFS(
          e,
          imgFile,
          nftFeed,
          100,
          storeUser.userWalletAddress,
          userKey
        );
        setApiFeed({
          ...apiFeed,
          feedImg: feedNft[0],
          transactionHash: feedNft[1]
        });
        const res = await addFeed(
          {
            ...apiFeed,
            feedImg: feedNft[0],
            transactionHash: feedNft[1]
          },
          imgFile
        );
        if (res.status === 200) {
          dispatch(setIsLoading(false));
          alert("????????? ?????????????????????.");
        }
      } catch (error) {
        console.error(error);
        alert("????????? ????????? ??????????????????.");
        dispatch(setIsLoading(false));
      }
    }
  };
  return (
    <div className={`${styles.wrapper}`}>
      <div>
        <div className={`${styles.memoryNav} flex justify-space-between`}>
          <button
            className={`${styles.backbutton}`}
            onClick={() => router.back()}
            type="button"
          >
            <Image src={back} alt="#" />
          </button>
          <button
            className={`${styles.createbutton} notoMid fs-16`}
            type="button"
            onClick={(e) => {
              makeNFT(e);
            }}
          >
            ????????????
          </button>
        </div>
        <div className={`${styles.inputForm} flex justify-space-around`}>
          <input
            className={`${styles.image}`}
            onChange={(e) => handleImageUpload(e)}
            id="uploadimg"
            type="file"
            accept="image/gif, image/jpeg, image/png"
            hidden
          />
          <label className={`${styles.image}`} htmlFor="uploadimg">
            {uploadimg ? (
              <img className={`${styles.preview}`} src={uploadimg} alt="#" />
            ) : (
              <div
                className={`${styles.noimg} flex justify-center align-center`}
              >
                <Image src={addimg} alt="#" />
              </div>
            )}
          </label>
          <textarea
            className={`${styles.text} fs-16 notoMid`}
            placeholder="?????? ??????..."
            onChange={(e) => {
              setNftFeed({ ...nftFeed, content: e.target.value });
              setApiFeed({ ...apiFeed, content: e.target.value });
            }}
          />
        </div>
      </div>
      <div className={`${styles.place} flex justify-start align-center`}>
        <h1 className={`${styles.space} fs-16 notoMid`}>
          ?????? ?????? ????????? ??????????????????!
        </h1>
      </div>
      <MyLocation />
    </div>
  );
}

export default Create;
