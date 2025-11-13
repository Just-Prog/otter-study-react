import BRAINSTORM from "@/assets/icons/activity/icon-brainstorm.png";
import COURSEWARE from "@/assets/icons/activity/icon-courseware.png";
import EXAM_NOTICE from "@/assets/icons/activity/icon-exam-notice.png";
import EXTERNAL_LINKS from "@/assets/icons/activity/icon-external_links.png";
import HOMEWORK from "@/assets/icons/activity/icon-homework.png";
import NOTICE from "@/assets/icons/activity/icon-notice.png";
import PRACTICE from "@/assets/icons/activity/icon-practive.png";
import SIGN_IN from "@/assets/icons/activity/icon-sign-in.png";
import TEST from "@/assets/icons/activity/icon-test.png";
import VIDEO from "@/assets/icons/activity/icon-video.png";
import VOTE from "@/assets/icons/activity/icon-vote.png";
import FILE_MSXLS from "@/assets/icons/files/icon-excel.png";
import FILE_IMAGE from "@/assets/icons/files/icon-img.png";
import FILE_MARKDOWN from "@/assets/icons/files/icon-md.png";
import FILE from "@/assets/icons/files/icon-other.png";
import FILE_PDF from "@/assets/icons/files/icon-pdf.png";
import FILE_MSPPT from "@/assets/icons/files/icon-ppt.png";
import FILE_ARCHIVE from "@/assets/icons/files/icon-rar.png";
import FILE_PLAIN_TEXT from "@/assets/icons/files/icon-txt.png";
import FILE_VIDEO from "@/assets/icons/files/icon-video.png";
import FILE_MSDOC from "@/assets/icons/files/icon-word.png";
import SYSTEM_NOTICE from "@/assets/icons/message/icon-system-notice.png";

const activityDesc = {
  0: { name: "作业", icon: HOMEWORK },
  1: { name: "头脑风暴", icon: BRAINSTORM },
  2: { name: "测试", icon: TEST },
  3: { name: "通知", icon: NOTICE },
  4: { name: "签到", icon: SIGN_IN },
  5: { name: "课件", icon: COURSEWARE },
  6: { name: "活动", icon: SYSTEM_NOTICE },
  12: { name: "视频", icon: VIDEO },
  13: { name: "问卷", icon: VOTE },
  14: { name: "考试", icon: EXAM_NOTICE },
  15: { name: "练习", icon: PRACTICE },
  16: {
    name: "外部链接",
    icon: EXTERNAL_LINKS,
  },
  "-1": {
    name: "默认系统通知标题",
    icon: SYSTEM_NOTICE,
  },
};

const fileExt2Icons = (ext) => {
  switch (ext) {
    case "mp4":
    case "ts":
    case "mov":
    case "flv":
    case "mpg":
    case "wmv":
    case "avi":
      return FILE_VIDEO;

    case "png":
    case "jpg":
    case "jpeg":
    case "svg":
    case "bmp":
    case "gif":
    case "webp":
      return FILE_IMAGE;

    case "rar":
    case "zip":
      return FILE_ARCHIVE;

    case "doc":
    case "docx":
      return FILE_MSDOC;

    case "xls":
    case "xlsx":
      return FILE_MSXLS;

    case "ppt":
    case "pptx":
      return FILE_MSPPT;

    case "pdf":
      return FILE_PDF;

    case "txt":
      return FILE_PLAIN_TEXT;

    case "md":
      return FILE_MARKDOWN;

    default:
      return FILE;
  }
};

const classTypeDesc = {
  CLASS_COURSE: "班课",
  GROWTH_COURSE: "成长",
  PRACTICE_ARENA: "练习",
};

export { activityDesc, fileExt2Icons, classTypeDesc };
