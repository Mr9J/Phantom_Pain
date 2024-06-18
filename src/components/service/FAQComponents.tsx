import React, { useState } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQComponentProps {
  onQuestionClick: (answer: string) => void;
}

const faqs: FAQ[] = [
  { question: "如何在平台上架新的募資專案？", answer: "您可以在我們的平台上點擊「創建專案」，填寫專案詳情並提交審核。審核通過後，您的專案即可開始募資。" },
  { question: "如何設定專案的上架時間和價格？", answer: "在專案管理頁面，您可以設定專案的開始和結束時間，以及產品的定價。" },
  { question: "如何邀請其他人共同編輯專案？", answer: "在專案設置中選擇「共同編輯」，輸入對方的郵箱地址，邀請他們加入專案編輯。" },
  { question: "如果募資成功，款項如何處理？", answer: "募資成功後，款項將扣除相應的手續費後，劃撥至您指定的銀行帳戶。" },
  { question: "如何查看專案的募資進度？", answer: "您可以在「我的專案」頁面查看各專案的募資進度和支持者信息。" },
  { question: "可以修改已上架的專案內容嗎？", answer: "專案一旦開始募資，核心內容（如募資目標、獎勵設定）將無法修改，但可以更新專案日誌和FAQ等部分。" },
  { question: "如何撤銷或終止正在進行的專案？", answer: "如果需要撤銷或終止專案，請聯繫客服，提供合理的撤銷理由和證據。" },
  { question: "專案募資未成功會如何處理？", answer: "如果專案未達到募資目標，則所有支持資金將退回給支持者。" },
  { question: "支持者需要支付哪些費用？", answer: "支持者在承諾支持金額時，會明確看到您設定的產品價格和可能的運輸費用。" },
  { question: "如何保護我的知識產權？", answer: "建議在上架專案前對您的創意或產品進行相應的知識產權登記保護。" },
  { question: "支持者如何取消支持？", answer: "支持者可以在專案結束前聯繫客服進行支持撤銷，具體根據專案設定可能有所不同。" },
  { question: "我的專案可以設定哪些不同的回報選項？", answer: "您可以設定多種回報選項，包括但不限於產品預售、感謝信、定制商品等。" }
];

const FAQComponent: React.FC<FAQComponentProps> = ({ onQuestionClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (answer: string) => {
    console.log("FAQ item clicked:", answer);
    onQuestionClick(answer);
  };

  return (
    <div className="service-FAQ-container">
      <button className="faq-toggle-button" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "隱藏常見問題" : "顯示常見問題"}
      </button>
      {isOpen && (
        <div className="service-FAQ-list">
          {faqs.map((faq, index) => (
            <div key={index} className="service-FAQ-item" onClick={() => handleClick(faq.answer)}>
              <p>{faq.question}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FAQComponent;
