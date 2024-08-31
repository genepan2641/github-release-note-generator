import cssText from "data-text:~style.css";
import type {
  PlasmoCSConfig,
  PlasmoCSUIProps,
  PlasmoGetInlineAnchorList
} from "plasmo";
import { useState } from "react";
import showdown from "showdown";

export const getStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
};

export const config: PlasmoCSConfig = {
  matches: ["https://github.com/AlleyPin/*"]
};

export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () => {
  const currentUrl = window.location.href;
  const regex = /github\.com\/AlleyPin\/([^/]+)\/releases/;
  const match = currentUrl.match(regex);

  if (match) {
    return document.querySelectorAll("a.Link--primary.Link");
  }

  return null;
};

const PlasmoInline = ({ anchor }: PlasmoCSUIProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleClickCopyBtn = async () => {
    const currentUrl = window.location.href;
    const match = currentUrl.match(/github\.com\/AlleyPin\/([^/]+)\/releases/);
    const repoName = match
      ? match[1]?.charAt(0).toUpperCase() + match[1]?.slice(1)
      : null;

    const boxBodyDOM = anchor.element.closest(".Box-body");
    const versionLinkDOM: HTMLAnchorElement = anchor.element.closest(
      "a.Link--primary.Link"
    );
    const markdownDOM = boxBodyDOM.querySelector(".markdown-body");
    const htmlContent = `
        :car: :car: :car:<br>
        <b>${repoName} <a href=${versionLinkDOM.href}>${versionLinkDOM.text}</a><br></b>
        ${markdownDOM.innerHTML}
        `;

    const conv = new showdown.Converter();
    const textContent = conv.makeMarkdown(htmlContent);

    const clipboardItem = new ClipboardItem({
      "text/plain": new Blob([textContent], { type: "text/plain" }),
      "text/html": new Blob([htmlContent], {
        type: "text/html"
      })
    });

    try {
      await navigator.clipboard.write([clipboardItem]);
      setIsCopied(true);
    } catch (error) {
      console.log("Copy failed");
      console.log(error);
    } finally {
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    }
  };

  return (
    <div className="plasmo-flex plasmo-items-center">
      <button
        className={`plasmo-inline-block plasmo-rounded plasmo-border plasmo-border-none plasmo-px-2 plasmo-py-1
      plasmo-text-white plasmo-font-medium plasmo-text-xs
      ${isCopied ? "plasmo-cursor-not-allowed plasmo-bg-gray-200 plasmo-text-gray-400" : "plasmo-bg-blue-600 hover:plasmo-bg-blue-500"}`}
        onClick={handleClickCopyBtn}
        disabled={isCopied}>
        {isCopied ? "✅ Copied" : "Copy Release Note"}
      </button>
    </div>
  );
};

export default PlasmoInline;
