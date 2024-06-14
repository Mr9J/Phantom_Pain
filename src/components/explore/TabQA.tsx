import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
function TabQA() {
  const mockQA = [
    {
      question: "商品有現貨嗎？需要等待多久才能收到？",
      answer:
        "我們的商品大部分都有現貨，訂單確認後通常會在1-2個工作日內發貨。發貨後，您將會收到一封包含追蹤號碼的確認電子郵件，您可以通過該追蹤號碼實時跟踪您的訂單狀態。一般來說，國內配送大約需要3-7個工作日，國際配送則需7-14個工作日，具體時間會因地區和物流公司而異。如有任何延遲，我們會及時通知您並提供相應的解決方案。",
    },
    {
      question: "如果商品有問題，我該如何退換貨？",
      answer:
        "我們提供7天無理由退換貨服務。若您收到的商品有任何問題或與描述不符，請在收到商品的7天內通過電子郵件或客服熱線聯繫我們。我們將提供退換貨的詳細指引，並確保您獲得滿意的解決方案。請注意，退換貨的商品必須保持全新狀態，且包含所有原始包裝和配件。我們會在收到退回商品後的5個工作日內處理退款或更換。",
    },
    {
      question: " 可以提供發票嗎？如何索取？",
      answer:
        "我們可以為所有購買提供正式發票。如果您需要發票，請在下單時選擇“需要發票”選項，並填寫相關的開票信息，包括您的公司名稱、納稅人識別號、地址和聯繫方式等。我們將在發貨時將發票一同寄出。如果您在下單後需要補開發票，請在訂單發貨後7天內聯繫客服提供相關信息，我們將盡快為您處理。",
    },
    {
      question: "商品是否有保固服務？如何申請保修？",
      answer:
        "我們的商品均享有保固服務，具體保固期限視商品種類而定，一般為1至2年。若您的商品在保固期內出現質量問題，請立即聯繫我們的客服團隊。我們將指導您如何進行保修申請，並提供相應的解決方案，包括維修或更換。請您在申請保修時，提供購買證明和故障描述，以便我們更快地處理您的需求。",
    },
    {
      question: "如何選擇適合我的商品尺寸或規格？",
      answer:
        "為了幫助您選擇最適合的商品，我們在每個商品頁面都提供了詳細的尺寸表和規格說明。您可以參考這些信息來選擇適合您的尺寸或規格。如果您對尺寸或規格有任何疑問，歡迎隨時聯繫我們的客服團隊，我們將根據您的需求提供專業的建議和指導，確保您選擇的商品能夠滿足您的需求。",
    },
  ];

  return (
    <Accordion type="single" collapsible>
      {mockQA.map((item, index) => (
        <AccordionItem value={index.toString()}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default TabQA;
