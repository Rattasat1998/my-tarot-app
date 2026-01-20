import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, History, Info, RefreshCw, Moon, Sun, ArrowLeft, Maximize2 } from 'lucide-react';
import shuffleSoundUrl from './assets/tarot-shuffle-89105.mp3';

const TAROT_CARDS = [
  // Major Arcana (22 cards)
  { id: 1, name: 'The Fool', nameThai: 'ไพ่เดอะฟูล', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m00.jpg', description: 'การเริ่มต้นใหม่ที่เป็นอิสระ การผจญภัยที่ไร้ความกลัว ความไร้เดียงสา นี่คือช่วงเวลาแห่งการก้าวกระโดดด้วยความศรัทธา จงวางใจในสัญชาตญาณและเปิดรับโอกาสใหม่ๆ ที่เข้ามาในชีวิต' },
  { id: 2, name: 'The Magician', nameThai: 'ไพ่นักมายากล', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m01.jpg', description: 'พลังแห่งการสร้างสรรค์ การลงมือทำด้วยความมั่นใจ คุณมีทรัพยากรและทักษะที่จำเป็นในการทำให้เป้าหมายเป็นจริง จงใช้พลังของคุณอย่างชาญฉลาดเพื่อเนรมิตสิ่งที่ต้องการ' },
  { id: 3, name: 'The High Priestess', nameThai: 'ไพ่ราชินีพระจันทร์', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m02.jpg', description: 'สัญชาตญาณที่ลึกซึ้ง ความลึกลับที่ซ่อนอยู่ การฟังเสียงภายในใจ นี่คือช่วงเวลาที่ควรนิ่งสงบและเชื่อมต่อกับจิตวิญญาณ คำตอบที่คุณค้นหาซ่อนอยู่ภายในตัวคุณเอง' },
  { id: 4, name: 'The Empress', nameThai: 'ไพ่จักรพรรดินี', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m03.jpg', description: 'ความอุดมสมบูรณ์ ความเมตตา ความสวยงามของธรรมชาติ และความเป็นแม่ เป็นตัวแทนของการกำเนิดสิ่งใหม่และการเติบโตอย่างงดงาม จงบ่มเพาะสิ่งดีๆ รอบตัวคุณ' },
  { id: 5, name: 'The Emperor', nameThai: 'ไพ่จักรพรรดิ', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m04.jpg', description: 'ความเป็นผู้นำที่มั่นคง อำนาจ ระเบียบวินัย และความรับผิดชอบ คุณจำเป็นต้องมีความเด็ดขาดและใช้เหตุผลในการตัดสินใจ โครงสร้างและกฎเกณฑ์จะนำมาซึ่งความสำเร็จ' },
  { id: 6, name: 'The Hierophant', nameThai: 'ไพ่พระสังฆราช', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m05.jpg', description: 'ประเพณีอันศักดิ์สิทธิ์ ความเชื่อ ศาสนา และการถ่ายทอดความรู้ การยึดมั่นในค่านิยมดั้งเดิมหรือการขอคำแนะนำจากผู้ที่มีปัญญาจะช่วยนำทางคุณได้' },
  { id: 7, name: 'The Lovers', nameThai: 'ไพ่คู่รัก', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m06.jpg', description: 'ความรักที่ลึกซึ้ง การเลือกทางเดินชีวิต และความปรองดอง มันอาจหมายถึงความสัมพันธ์ที่สำคัญหรือการตัดสินใจที่ต้องใช้หัวใจนำทาง การสร้างสมดุลระหว่างสองสิ่งที่แตกต่างเป็นกุญแจสำคัญ' },
  { id: 8, name: 'The Chariot', nameThai: 'ไพ่อัศวินรถม้า', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m07.jpg', description: 'ชัยชนะจากความมุ่งมั่น การควบคุมตนเอง และการก้าวไปข้างหน้าอย่างกล้าหาญ อย่าปล่อยให้อุปสรรคมาขวางทาง จงรวบรวมพลังใจและมุ่งตรงไปยังเป้าหมายด้วยความไม่ย่อท้อ' },
  { id: 9, name: 'Strength', nameThai: 'ไพ่ความแข็งแกร่ง', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m08.jpg', description: 'ความเข้มแข็งจากภายใน ความอดทน และความอ่อนโยนที่ชนะความก้าวร้าว การควบคุมอารมณ์และการเผชิญหน้ากับความกลัวด้วยความเมตตาคือพลังที่แท้จริงของคุณ' },
  { id: 10, name: 'The Hermit', nameThai: 'ไพ่ฤๅษี', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m09.jpg', description: 'การค้นหาคำตอบภายในใจ การปลีกวิเวกเพื่อตกผลึกความคิด บางครั้งคุณต้องถอยออกมาจากความวุ่นวายเพื่อทบทวนเส้นทางของตัวเอง แสงสว่างแห่งปัญญารอคุณอยู่ในความเงียบสงบ' },
  { id: 11, name: 'Wheel of Fortune', nameThai: 'ไพ่กงล้อแห่งโชคชะตา', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m10.jpg', description: 'วัฏจักรแห่งชีวิต โชคชะตาที่หมุนเวียน และการเปลี่ยนแปลงที่หลีกเลี่ยงไม่ได้ จงเตรียมพร้อมรับมือกับสิ่งที่ควบคุมไม่ได้ และเรียนรู้ที่จะไหลไปตามกระแสแห่งโชคชะตา' },
  { id: 12, name: 'Justice', nameThai: 'ไพ่ความยุติธรรม', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m11.jpg', description: 'ความยุติธรรม ความสมเหตุสมผล และผลกรรมจากการกระทำ ทุกการกระทำย่อมมีผลตามมา การตัดสินใจของคุณควรตั้งอยู่บนพื้นฐานของความจริงและความถูกต้อง' },
  { id: 13, name: 'The Hanged Man', nameThai: 'ไพ่คนแขวนคอ', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m12.jpg', description: 'การมองโลกในมุมมองใหม่ การเสียสละเพื่อสิ่งที่ยิ่งใหญ่กว่า บางครั้งการหยุดนิ่งหรือยอมจำนนชั่วคราวเพื่อรอจังหวะเวลาที่เหมาะสมอาจนำมาซึ่งการรู้แจ้งในภายหลัง' },
  { id: 14, name: 'Death', nameThai: 'ไพ่ความตาย', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m13.jpg', description: 'การสิ้นสุดเพื่อเริ่มต้นใหม่ การเปลี่ยนแปลงครั้งใหญ่และการปล่อยวาง สิ่งเก่าต้องจบลงเพื่อให้สิ่งใหม่ได้ถือกำเนิด อย่ากลัวการเปลี่ยนแปลง เพราะมันคือส่วนหนึ่งของวัฏจักรธรรมชาติ' },
  { id: 15, name: 'Temperance', nameThai: 'ไพ่ความพอประมาณ', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m14.jpg', description: 'ความสมดุล ความพอดี การผสมผสานสิ่งที่แตกต่างให้ลงตัว การรักษาความสงบในใจและการประนีประนอมจะช่วยแก้ไขปัญหาได้ จงหลีกเลี่ยงความสุดโต่งและหาจุดกึ่งกลางที่ลงตัว' },
  { id: 16, name: 'The Devil', nameThai: 'ไพ่ปีศาจ', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m15.jpg', description: 'กิเลสครอบงำ ความยึดติดทางวัตถุ และพันธนาการที่สร้างขึ้นเอง คุณอาจกำลังตกเป็นทาสของความต้องการหรือนิสัยที่ไม่ดี จงตระหนักรู้และปลดปล่อยตัวเองจากโซ่ตรวนที่มองไม่เห็น' },
  { id: 17, name: 'The Tower', nameThai: 'ไพ่ตึกถล่ม', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m16.jpg', description: 'การเปลี่ยนแปลงอย่างฉับพลัน การพังทลายของสิ่งจอมปลอมเพื่อสร้างใหม่ แม้มันจะดูเลวร้าย แต่การทำลายล้างนี้จะเปิดทางให้ความจริงและสิ่งที่ดีกว่าได้เข้ามาแทนที่' },
  { id: 18, name: 'The Star', nameThai: 'ไพ่ดวงดาว', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m17.jpg', description: 'ความหวังใหม่ การเยียวยาจิตใจ และแรงบันดาลใจจากเบื้องบน หลังจากพายุผ่านพ้น แสงดาวแห่งความหวังจะนำทางคุณไปสู่อนาคตที่สดใส จงมีความเชื่อและศรัทธาในตัวเอง' },
  { id: 19, name: 'The Moon', nameThai: 'ไพ่พระจันทร์', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m18.jpg', description: 'ความสับสนในจิตใจ จินตนาการ และสิ่งที่ซ่อนอยู่ในความมืด สัญชาตญาณของคุณกำลังทำงานอย่างหนัก ระวังภาพลวงตาและความกลัวที่ไม่มีอยู่จริง จงมองให้ลึกกว่าสิ่งที่เห็น' },
  { id: 20, name: 'The Sun', nameThai: 'ไพ่พระอาทิตย์', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m19.jpg', description: 'ความสำเร็จที่สดใส ความสุข ความชัดเจน และพลังงานบวก ช่วงเวลาแห่งความเบิกบานใจและการเฉลิมฉลอง ทุกอย่างกำลังดำเนินไปในทิศทางที่ดี จงเปิดรับความอบอุ่นแห่งชีวิต' },
  { id: 21, name: 'Judgement', nameThai: 'ไพ่การตัดสิน', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m20.jpg', description: 'การตื่นรู้ทางจิตวิญญาณ การได้รับการให้อภัย และการเริ่มต้นชีวิตใหม่ ถึงเวลาปลดปล่อยอดีตและก้าวไปข้างหน้าตามเสียงเรียกของจิตวิญญาณ การตัดสินใจครั้งสำคัญรอคุณอยู่' },
  { id: 22, name: 'The World', nameThai: 'ไพ่โลก', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/m21.jpg', description: 'ความสมบูรณ์แบบ ความสำเร็จสูงสุด และการเดินทางที่สิ้นสุดลงอย่างงดงาม คุณได้บรรลุเป้าหมายสำคัญหรือวัฏจักรหนึ่งได้จบลงอย่างสมบูรณ์ โลกทั้งใบอยู่ในมือของคุณ' },

  // Minor Arcana - Wands (ไม้เท้า) - พลังงาน ความคิดสร้างสรรค์ การกระทำ
  { id: 23, name: 'Ace of Wands', nameThai: '1 ไม้เท้า', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/w01.jpg', description: 'แรงบันดาลใจใหม่ๆ การเริ่มต้นโครงการที่น่าตื่นเต้น พลังสร้างสรรค์ที่พลุ่งพล่าน นี่คือสัญญาณให้คุณลงมือทำตามความฝันด้วยความกล้าหารและไฟแรงกล้า' },
  { id: 24, name: 'Two of Wands', nameThai: '2 ไม้เท้า', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/w02.jpg', description: 'การวางแผนระยะยาว การมองหาโอกาสใหม่ และการตัดสินใจเลือกเส้นทาง คุณมีศักยภาพที่จะก้าวไปได้ไกล จงมองออกไปให้ไกลกว่าจุดที่คุณยืนอยู่และกล้าที่จะขยายขอบเขต' },
  { id: 25, name: 'Three of Wands', nameThai: '3 ไม้เท้า', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/w03.jpg', description: 'การขยายตัว ความก้าวหน้า การมองไปยังอนาคต และการรอคอยผลสำเร็จ สิ่งที่คุณได้ริเริ่มไว้กำลังเริ่มส่งผล การร่วมมือหรือการเดินทางไกลอาจนำมาซึ่งโอกาสที่ดี' },
  { id: 26, name: 'Four of Wands', nameThai: '4 ไม้เท้า', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/w04.jpg', description: 'การเฉลิมฉลอง ความมั่นคงในครอบครัว และความสุขจากการทำงานหนัก ช่วงเวลาแห่งความยินดีและความสำเร็จขั้นต้น เป็นเวลาที่เหมาะแก่การพักผ่อนและชื่นชมผลงานของตนเอง' },
  { id: 27, name: 'Five of Wands', nameThai: '5 ไม้เท้า', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/w05.jpg', description: 'ความขัดแย้งเล็กๆ น้อยๆ การแข่งขัน และความท้าทายที่ต้องฝ่าฟัน อาจมีความคิดเห็นที่ไม่ตรงกันหรืออุปสรรคที่ต้องแก้ไข จงใช้ความพยายามและความมุ่งมั่นเพื่อเอาชนะ' },
  { id: 28, name: 'Six of Wands', nameThai: '6 ไม้เท้า', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/w06.jpg', description: 'ชัยชนะ การได้รับการยอมรับ ความสำเร็จจากความพยายาม คุณได้รับการชื่นชมจากความสำเร็จที่ผ่านมา จงภาคภูมิใจในตัวเองแต่อย่าประมาท พร้อมก้าวต่อไปข้างหน้า' },
  { id: 29, name: 'Seven of Wands', nameThai: '7 ไม้เท้า', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/w07.jpg', description: 'การยืนหยัดต่อสู้ การป้องกันตำแหน่งของตนเอง และความกล้าหาญ คุณอาจต้องเผชิญกับแรงกดดันหรือคู่แข่ง แต่ด้วยความเชื่อมั่นในจุดยืน คุณจะสามารถผ่านพ้นไปได้' },
  { id: 30, name: 'Eight of Wands', nameThai: '8 ไม้เท้า', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/w08.jpg', description: 'การเคลื่อนไหวที่รวดเร็ว ข่าวสารที่มาถึงไว และความก้าวหน้าอย่างรวดเร็ว สถานการณ์ต่างๆ จะคลี่คลายอย่างรวดเร็ว เตรียมตัวรับข่าวดีหรือการเปลี่ยนแปลงที่เกิดขึ้นปุบปับ' },
  { id: 31, name: 'Nine of Wands', nameThai: '9 ไม้เท้า', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/w09.jpg', description: 'ความอดทนเฮือกสุดท้าย การเตรียมพร้อมป้องกันตัว และความไม่ประมาท แม้จะเหนื่อยล้าและผ่านศึกมามาก แต่คุณใกล้จะถึงเส้นชัยแล้ว อีกเพียงนิดเดียวเท่านั้น อย่าเพิ่งยอมแพ้' },
  { id: 32, name: 'Ten of Wands', nameThai: '10 ไม้เท้า', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/w10.jpg', description: 'ภาระหน้าที่อันหนักหน่วง ความรับผิดชอบที่มากเกินไป และความมุมานะ คุณอาจแบกรับภาระไว้เกินตัว ถึงเวลาที่ต้องรู้จักแบ่งเบาหรือปล่อยวางบางอย่างเพื่อรักษาสมดุล' },
  { id: 33, name: 'Page of Wands', nameThai: 'เด็กถือไม้เท้า', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/w11.jpg', description: 'เด็กหนุ่มผู้กระตือรือร้น ข่าวดีเรื่องงาน และการค้นพบสิ่งที่ชอบ พลังงานแห่งความอยากรู้อยากเห็นและการเริ่มต้นสิ่งใหม่ๆ จงเปิดใจรับโอกาสที่เข้ามาด้วยความตื่นเต้น' },
  { id: 34, name: 'Knight of Wands', nameThai: 'อัศวินถือไม้เท้า', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/w12.jpg', description: 'การลงมือทำอย่างบ้าบิ่น ความรีบร้อน และการผจญภัยที่น่าตื่นเต้น มีพลังงานล้นเหลือที่ผลักดันให้เดินหน้า แต่อย่าลืมวางแผนให้รอบคอบก่อนกระโจนลงไป' },
  { id: 35, name: 'Queen of Wands', nameThai: 'ราชินีถือไม้เท้า', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/w13.jpg', description: 'ความมั่นใจในตนเอง เสน่ห์ดึงดูด และความเป็นผู้นำที่มีพลัง คุณมีความสามารถในการจัดการและดึงดูดผู้คน เป็นตัวของตัวเองและใช้พลังบวกของคุณสร้างแรงบันดาลใจ' },
  { id: 36, name: 'King of Wands', nameThai: 'ราชาถือไม้เท้า', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/w14.jpg', description: 'วิสัยทัศน์กว้างไกล ผู้นำที่สร้างแรงบันดาลใจ และความมุ่งมั่นสู่เป้าหมาย คุณมีความเป็นผู้นำสูงและมองเห็นภาพใหญ่ จงใช้ประสบการณ์และความกล้าหาญในการนำทางสู่ความสำเร็จ' },

  // Minor Arcana - Cups (ถ้วย) - อารมณ์ ความรัก ความสัมพันธ์
  { id: 37, name: 'Ace of Cups', nameThai: '1 ถ้วย', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/c01.jpg', description: 'การเริ่มต้นของความรักใหม่ อารมณ์ความรู้สึกที่เอ่อล้น และความสุขทางใจ หัวใจของคุณเปิดกว้างพร้อมรับความรักและความปรารถนาดี เป็นช่วงเวลาแห่งการเยียวยา' },
  { id: 38, name: 'Two of Cups', nameThai: '2 ถ้วย', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/c02.jpg', description: 'คู่รักที่เข้ากันได้ดี ความร่วมมือที่ลงตัว และมิตรภาพที่แน่นแฟ้น ความสัมพันธ์ที่สมดุลและการแลกเปลี่ยนความรู้สึกดีๆ ต่อกัน การผูกพันทางใจที่ลึกซึ้ง' },
  { id: 39, name: 'Three of Cups', nameThai: '3 ถ้วย', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/c03.jpg', description: 'งานเลี้ยงสังสรรค์ ความรื่นเริงในกลุ่มเพื่อน และความสำเร็จร่วมกัน ช่วงเวลาแห่งความเฉลิมฉลองมิตรภาพและความสามัคคี แบ่งปันความสุขกับคนที่คุณรัก' },
  { id: 40, name: 'Four of Cups', nameThai: '4 ถ้วย', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/c04.jpg', description: 'ความเบื่อหน่าย การเมินเฉยต่อโอกาสที่เข้ามา และการทบทวนความรู้สึก คุณอาจรู้สึกไม่พอใจกับสิ่งที่มีอยู่ แต่ลองมองดูให้ดี โอกาสดีๆ อาจอยู่ตรงหน้าคุณแล้ว' },
  { id: 41, name: 'Five of Cups', nameThai: '5 ถ้วย', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/c05.jpg', description: 'ความผิดหวัง การสูญเสีย และการจมอยู่กับความเศร้าในอดีต อย่ามัวแต่มองถ้วยที่หกไปแล้ว จนลืมว่ายังมีถ้วยที่ตั้งอยู่ ความหวังยังคงมีอยู่เสมอหากคุณเงยหน้าขึ้นมอง' },
  { id: 42, name: 'Six of Cups', nameThai: '6 ถ้วย', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/c06.jpg', description: 'ความทรงจำในวัยเด็ก การหวนคืนของคนรักเก่า และความสุขที่เรียบง่าย การนึกถึงอดีตที่หอมหวานหรือการได้รับของขวัญจากใจ ความบริสุทธิ์ใจและความจริงใจ' },
  { id: 43, name: 'Seven of Cups', nameThai: '7 ถ้วย', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/c07.jpg', description: 'ทางเลือกที่มีมากมาย จินตนาการที่เพ้อฝัน และภาพลวงตา ระวังการหลงระเริงไปกับความฝันจนลืมความจริง จงพิจารณาทางเลือกต่างๆ อย่างรอบคอบก่อนตัดสินใจ' },
  { id: 44, name: 'Eight of Cups', nameThai: '8 ถ้วย', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/c08.jpg', description: 'การเดินจากสิ่งที่รักเพื่อค้นหาความหมายใหม่ และการปล่อยวาง ถึงเวลาที่ต้องก้าวออกจากจุดเดิมเพื่อตามหาสิ่งที่เติมเต็มจิตวิญญาณ แม้จะยากลำบากแต่ก็จำเป็น' },
  { id: 45, name: 'Nine of Cups', nameThai: '9 ถ้วย', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/c09.jpg', description: 'ความสุขสมหวังดั่งใจปรารถนา ความพอใจในตนเอง และความอุดมสมบูรณ์ ช่วงเวลาแห่งความอิ่มเอมใจ สิ่งที่หวังไว้จะเป็นจริง จงมีความสุขกับปัจจุบัน' },
  { id: 46, name: 'Ten of Cups', nameThai: '10 ถ้วย', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/c10.jpg', description: 'ครอบครัวที่อบอุ่น ความสุขที่สมบูรณ์แบบ และความปรองดอง ภาพฝันของชีวิตครอบครัวที่มีความสุข ความสัมพันธ์ที่ยั่งยืนและความรักที่เติมเต็มซึ่งกันและกัน' },
  { id: 47, name: 'Page of Cups', nameThai: 'เด็กถือถ้วย', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/c11.jpg', description: 'ข่าวสารเรื่องความรัก จินตนาการแบบเด็กๆ และความอ่อนไหว การเริ่มต้นของความรู้สึกใหม่ๆ หรือความคิดสร้างสรรค์ทางศิลปะ จงเปิดรับความรู้สึกของตัวเอง' },
  { id: 48, name: 'Knight of Cups', nameThai: 'อัศวินถือถ้วย', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/c12.jpg', description: 'ข้อเสนอเรื่องความรัก การมาถึงของคนโรแมนติก และการทำตามหัวใจ การเดินทางตามหาความรักหรืออุดมการณ์ อย่าลืมรักษาความสมดุลระหว่างความฝันและความจริง' },
  { id: 49, name: 'Queen of Cups', nameThai: 'ราชินีถือถ้วย', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/c13.jpg', description: 'ความเห็นอกเห็นใจ สัญชาตญาณแม่ และอารมณ์ที่ลึกซึ้ง คุณมีความเข้าใจผู้อื่นอย่างลึกซึ้งและเป็นที่พึ่งทางใจได้ดี จงเชื่อในสัญชาตญาณและความรู้สึกของตัวเอง' },
  { id: 50, name: 'King of Cups', nameThai: 'ราชาถือถ้วย', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/c14.jpg', description: 'การควบคุมอารมณ์ได้ดี ความเมตตากรุณา และความเป็นผู้ใหญ่ทางใจ ผู้นำที่มีความเข้าใจในความรู้สึกและมีความยุติธรรม การให้คำปรึกษาด้วยปัญญาและความเมตตา' },

  // Minor Arcana - Swords (ดาบ) - ความคิด สติปัญญา อุปสรรค
  { id: 51, name: 'Ace of Swords', nameThai: '1 ดาบ', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/s01.jpg', description: 'ชัยชนะทางความคิด การตัดสินใจที่เด็ดขาด และความจริงที่ถูกเปิดเผย พลังแห่งสติปัญญาที่เฉียบคมสามารถตัดผ่านปัญหาและความสับสนได้ จงใช้ตรรกะและเหตุผล' },
  { id: 52, name: 'Two of Swords', nameThai: '2 ดาบ', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/s02.jpg', description: 'การลังเลใจ ไม่กล้าตัดสินใจ และการปิดกั้นตนเองจากความจริง คุณอาจกำลังหลีกหนีปัญหาหรือติดอยู่ระหว่างทางเลือกสองทาง ถึงเวลาเปิดตาและตัดสินใจเพื่อก้าวต่อไป' },
  { id: 53, name: 'Three of Swords', nameThai: '3 ดาบ', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/s03.jpg', description: 'ความเจ็บปวดทางใจ การอกหัก และความเศร้าโศกเสียใจ ช่วงเวลาแห่งความผิดหวังหรือการสูญเสีย แต่จำไว้ว่าความเจ็บปวดนี้จะผ่านไป และหัวใจจะได้รับการเยียวยา' },
  { id: 54, name: 'Four of Swords', nameThai: '4 ดาบ', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/s04.jpg', description: 'การพักผ่อนเพื่อฟื้นฟูพลัง การนิ่งสงบ และการปลีกตัวชั่วคราว หลังจากผ่านศึกหนักมา ร่างกายและจิตใจต้องการการพักผ่อน จงใช้เวลานี้ไตร่ตรองและรวบรวมพลังกลับคืนมา' },
  { id: 55, name: 'Five of Swords', nameThai: '5 ดาบ', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/s05.jpg', description: 'ชัยชนะที่ได้มาอย่างไม่ขาวสะอาด ความขัดแย้ง และความพ่ายแพ้ การเอาชนะที่ต้องแลกมาด้วยความสัมพันธ์อาจไม่คุ้มค่า รู้จักถอยหรือยอมแพ้บางศึกเพื่อชนะสงครามที่สำคัญกว่า' },
  { id: 56, name: 'Six of Swords', nameThai: '6 ดาบ', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/s06.jpg', description: 'การเดินทางหนีจากปัญหา การเปลี่ยนแปลงไปสู่สิ่งที่ดีกว่าอย่างช้าๆ คุณกำลังก้าวผ่านช่วงเวลาที่ยากลำบากไปยังที่ที่สงบสุขกว่า แม้จะยังมีร่องรอยความเศร้า แต่อนุาคตจะดีขึ้น' },
  { id: 57, name: 'Seven of Swords', nameThai: '7 ดาบ', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/s07.jpg', description: 'การหลอกลวง การทำอะไรลับหลัง และการใช้เล่ห์เหลี่ยม ระวังความไม่ซื่อสัตย์หรือการถูกเอาเปรียบ ในอีกมุมหนึ่งอาจหมายถึงการต้องใช้ไหวพริบและกลยุทธ์เพื่อเอาตัวรอด' },
  { id: 58, name: 'Eight of Swords', nameThai: '8 ดาบ', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/s08.jpg', description: 'ความรู้สึกมืดแปดด้าน การถูกจำกัดเสรีภาพ และความกลัวที่สร้างขึ้นเอง คุณอาจรู้สึกติดกับดักหาทางออกไม่เจอ แต่บ่อยครั้งที่พันธนาการเหล่านั้นเกิดจากความคิดของคุณเอง จงกล้าที่จะปลดปล่อยตัวเอง' },
  { id: 59, name: 'Nine of Swords', nameThai: '9 ดาบ', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/s09.jpg', description: 'ความวิตกกังวล การนอนไม่หลับ และฝันร้ายที่รบกวนจิตใจ ความเครียดและความกลัวในสิ่งที่ยังไม่เกิดขึ้นกำลังกัดกินใจ พยายามทำใจให้สงบและมองปัญหาตามความเป็นจริง' },
  { id: 60, name: 'Ten of Swords', nameThai: '10 ดาบ', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/s10.jpg', description: 'จุดจบของความเจ็บปวด ความล้มเหลวที่ถึงที่สุด และแสงสว่างหลังความมืด แม้จะดูเหมือนจุดต่ำสุด แต่มันคือจุดสิ้นสุดของวงจรเลวร้าย แสงแห่งวันใหม่กำลังรออยู่เบื้องหน้า' },
  { id: 61, name: 'Page of Swords', nameThai: 'เด็กถือดาบ', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/s11.jpg', description: 'ข่าวสารที่ว่องไว การสอดรู้สอดเห็น และความอยากรู้อยากเห็น เด็กหนุ่มผู้ฉลาดเฉลียวและช่างสังเกต ข้อมูลข่าวสารใหม่ๆ จะเข้ามา หรือคุณต้องใช้การสื่อสารที่ชัดเจนและตรงไปตรงมา' },
  { id: 62, name: 'Knight of Swords', nameThai: 'อัศวินถือดาบ', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/s12.jpg', description: 'การกระทำที่รวดเร็วฉับไว ความมุทะลุดุดัน และการพูดตรงไปตรงมา พลังแห่งการเปลี่ยนแปลงที่รุนแรงและรวดเร็ว จงระวังคำพูดที่อาจบาดใจผู้อื่นโดยไม่ตั้งใจ' },
  { id: 63, name: 'Queen of Swords', nameThai: 'ราชินีถือดาบ', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/s13.jpg', description: 'ความเฉลียวฉลาด การตัดสินใจด้วยเหตุผล และความเป็นตัวของตัวเอง หญิงแกร่งผู้ผ่านประสบการณ์มามากมาย เธอใช้สติปัญญาและความชัดเจนในการตัดปัญหาที่ไม่จำเป็นออกไป' },
  { id: 64, name: 'King of Swords', nameThai: 'ราชาถือดาบ', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/s14.jpg', description: 'ผู้นำที่มีสติปัญญา การใช้ตรรกะเหนืออารมณ์ และความยุติธรรม ผู้พิพากษาที่เที่ยงธรรม การตัดสินใจเด็ดขาดโดยยึดหลักการและความถูกต้องเป็นสำคัญ' },

  // Minor Arcana - Pentacles (เหรียญ) - การเงิน การงาน วัตถุ
  { id: 65, name: 'Ace of Pentacles', nameThai: '1 เหรียญ', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/p01.jpg', description: 'โอกาสทางการเงินใหม่ๆ โชคลาภ และความมั่งคั่งที่เริ่มต้นขึ้น เมล็ดพันธุ์แห่งความสำเร็จได้ถูกหว่านแล้ว นี่คือโอกาสทองในการเริ่มต้นธุรกิจหรือการลงทุน' },
  { id: 66, name: 'Two of Pentacles', nameThai: '2 เหรียญ', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/p02.jpg', description: 'การหมุนเงิน การปรับสมดุลในชีวิต และการจัดการกับความเปลี่ยนแปลง คุณต้องประคับประคองหลายสิ่งพร้อมกัน จงมีความยืดหยุ่นและปรับตัวตามสถานการณ์เพื่อรักษาสมดุล' },
  { id: 67, name: 'Three of Pentacles', nameThai: '3 เหรียญ', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/p03.jpg', description: 'การทำงานเป็นทีม ความชำนาญในวิชาชีพ และการได้รับการยอมรับ ความสำเร็จเกิดจากความร่วมมือและการใช้ทักษะเฉพาะด้าน ผลงานของคุณเป็นที่ประจักษ์และได้รับคำชม' },
  { id: 68, name: 'Four of Pentacles', nameThai: '4 เหรียญ', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/p04.jpg', description: 'การหวงแหนทรัพย์สิน ความตระหนี่ และความต้องการความมั่นคง คุณอาจกังวลเรื่องการเงินจนไม่กล้าใช้จ่าย หรือยึดติดกับสิ่งที่มรอยู่มากเกินไป รู้จักปล่อยวางบ้างเพื่อความสุข' },
  { id: 69, name: 'Five of Pentacles', nameThai: '5 เหรียญ', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/p05.jpg', description: 'ความขัดสนทางการเงิน ความยากลำบาก และความรู้สึกถูกทอดทิ้ง ช่วงเวลาที่ท้าทายทั้งกายและใจ อย่าอายที่จะขอความช่วยเหลือ เพราะยังมีคนพร้อมหยิบยื่นน้ำใจให้คุณเสมอ' },
  { id: 70, name: 'Six of Pentacles', nameThai: '6 เหรียญ', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/p06.jpg', description: 'การแบ่งปัน ความเอื้อเฟื้อเผื่อแผ่ และการได้รับความช่วยเหลือ ความสมดุลของการให้และการรับ หากคุณมีพอแล้วจงแบ่งปัน หากคุณขาดแคลนความช่วยเหลือจะมาถึง' },
  { id: 71, name: 'Seven of Pentacles', nameThai: '7 เหรียญ', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/p07.jpg', description: 'การรอคอยผลผลิต การประเมินผลงาน และการลงทุนระยะยาว คุณได้ลงแรงไปมากแล้ว ตอนนี้เป็นเวลาแห่งการรอคอยให้ต้นไม้ออกดอกออกผล จงอดทนและประเมินความก้าวหน้า' },
  { id: 72, name: 'Eight of Pentacles', nameThai: '8 เหรียญ', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/p08.jpg', description: 'การตั้งใจทำงานฝีมือ การฝึกฝนทักษะ และความขยันหมั่นเพียร ความสำเร็จเกิดจากการทุ่มเททำงานหนักและใส่ใจในรายละเอียด ทักษะของคุณกำลังพัฒนาไปสู่ระดับเชี่ยวชาญ' },
  { id: 73, name: 'Nine of Pentacles', nameThai: '9 เหรียญ', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/p09.jpg', description: 'ความมั่งคั่งที่สร้างด้วยตนเอง ชีวิตที่สุขสบาย และความอิสระ ผลตอบแทนจากการทำงานหนักทำให้คุณได้เสพสุขและมีความมั่นคง ภูมิใจในความสำเร็จของตนเองได้เต็มที่' },
  { id: 74, name: 'Ten of Pentacles', nameThai: '10 เหรียญ', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/p10.jpg', description: 'ความมั่งคั่งของวงศ์ตระกูล มรดกตกทอด และความมั่นคงระยะยาว ความสำเร็จที่ยั่งยืนและส่งต่อถึงลูกหลานได้ ความอบอุ่นและความปลอดภัยในครอบครัวที่สมบูรณ์' },
  { id: 75, name: 'Page of Pentacles', nameThai: 'เด็กถือเหรียญ', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/p11.jpg', description: 'โอกาสทางการศึกษา การเริ่มต้นธุรกิจใหม่ และความรอบคอบ นักเรียนผู้ขยันขันแข็งและกระตือรือร้น ข่าวดีเรื่องการเงินหรือโอกาสในการเรียนรู้ทักษะใหม่ๆ กำลังมาถึง' },
  { id: 76, name: 'Knight of Pentacles', nameThai: 'อัศวินถือเหรียญ', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/p12.jpg', description: 'ความมุ่งมั่นทำงานหนัก ความอดทน และความรับผิดชอบที่ไว้วางใจได้ การทำงานอย่างช้าๆ แต่มั่นคงและรอบคอบ ผลลัพธ์ที่ได้จะคุ้มค่ากับการรอคอยและความพยายาม' },
  { id: 77, name: 'Queen of Pentacles', nameThai: 'ราชินีถือเหรียญ', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/p13.jpg', description: 'ความดูแลเอาใจใส่ การจัดการการเงินที่ดี และความเป็นแม่บ้านแม่เรือน ผู้ที่สามารถดูแลทั้งเรื่องงานและเรื่องบ้านได้เป็นอย่างดี ความอบอุ่นและความมั่นคงทางวัตถุ' },
  { id: 78, name: 'King of Pentacles', nameThai: 'ราชาถือเหรียญ', img: 'https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/p14.jpg', description: 'นักธุรกิจที่ประสบความสำเร็จ ความมั่งคั่งมั่นคง และความใจกว้าง ผู้นำที่ประสบความสำเร็จสูงสุดในทางโลก มีความสามารถในการบริหาจัดการทรัพย์สินและทรัพยากรอย่างยอดเยี่ยม' }
];

// Placeholder component for Google Ads
const GoogleAdSlot = ({ className = "" }) => {
  useEffect(() => {
    try {
      // พยายามเรียก adsbygoogle เพื่อให้โฆษณาแสดงผลหลังจากคอมโพเนนต์ถูกติดตั้ง
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("Adsbygoogle error:", e);
    }
  }, []);

  return (
    <div className={`w-full max-w-4xl mx-auto my-8 p-4 border border-dashed border-slate-700 rounded-lg bg-slate-900/40 flex items-center justify-center min-h-[100px] overflow-hidden ${className}`}>
      <div className="text-center w-full">
        <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-2 font-sans">Advertisement</p>

        {/* AdSense Unit */}
        <ins className="adsbygoogle"
          style={{ display: 'block', textAlign: 'center' }}
          data-ad-client="ca-pub-6454901300191005"
          data-ad-slot="tarot_auto_slot"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
      </div>
    </div>
  );
};

const CardBack = () => (
  <div className="w-full h-full p-4 flex flex-col items-center justify-center border-[6px] border-double border-yellow-600/20 rounded-2xl relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950">
    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

    <div className="relative z-10 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
      <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
          fill="url(#moon-gradient)"
          stroke="#eab308"
          strokeWidth="0.5"
        />
        <defs>
          <linearGradient id="moon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <div className="absolute top-2 left-2 text-yellow-600/30 text-[10px]">✦</div>
    <div className="absolute top-2 right-2 text-yellow-600/30 text-[10px]">✦</div>
    <div className="absolute bottom-2 left-2 text-yellow-600/30 text-[10px]">✦</div>
    <div className="absolute bottom-2 right-2 text-yellow-600/30 text-[10px]">✦</div>
  </div>
);


const ShuffleAnimation = ({ onComplete }) => {
  useEffect(() => {
    // Play custom shuffle sound
    const audio = new Audio(shuffleSoundUrl);
    audio.volume = 0.5; // Set reasonable volume
    audio.play().catch(err => console.log('Audio playback failed:', err));

    const timer = setTimeout(onComplete, 2500);

    return () => {
      clearTimeout(timer);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [onComplete]);

  return (
    <div className="flex items-center justify-center h-64 relative preserve-3d">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute w-32 h-52 sm:w-40 sm:h-64 transition-all duration-500 ease-in-out"
          style={{
            animation: `shuffleCard 2s infinite ease-in-out`,
            animationDelay: `${i * 0.1}s`,
            zIndex: i
          }}
        >
          <CardBack />
        </div>
      ))}
    </div>
  );
};

const CuttingAnimation = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex items-center justify-center h-64 relative preserve-3d">
      {/* Bottom Half - Moves Up */}
      <div
        className="absolute w-32 h-52 sm:w-40 sm:h-64 transition-all"
        style={{
          animation: `cutBottom 2s ease-in-out forwards`,
          zIndex: 10
        }}
      >
        <CardBack />
        {/* Stack thickness effect */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="absolute inset-0 bg-slate-900/20 rounded-2xl border border-yellow-500/10" style={{ transform: `translate(${(i + 1) * 1}px, ${(i + 1) * 1}px)`, zIndex: -1 }}></div>
        ))}
      </div>

      {/* Top Half - Moves Right then Down */}
      <div
        className="absolute w-32 h-52 sm:w-40 sm:h-64 transition-all"
        style={{
          animation: `cutTop 2s ease-in-out forwards`,
          top: -4, left: -4,
          zIndex: 20
        }}
      >
        <CardBack />
        {/* Stack thickness effect */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="absolute inset-0 bg-slate-900/20 rounded-2xl border border-yellow-500/10" style={{ transform: `translate(${(i + 1) * 1}px, ${(i + 1) * 1}px)`, zIndex: -1 }}></div>
        ))}
      </div>
    </div>
  );
};

const App = () => {
  // Game States: 'MENU', 'SHUFFLING', 'CUTTING', 'PICKING', 'RESULT'
  const [gameState, setGameState] = useState('MENU');

  // Initialize deck with shuffled cards or default
  const [deck, setDeck] = useState(TAROT_CARDS);

  const [selectedCards, setSelectedCards] = useState([]);
  const [revealedIndices, setRevealedIndices] = useState([]);
  const [isRevealing, setIsRevealing] = useState(false);
  const [readingType, setReadingType] = useState('3-cards');
  const [topic, setTopic] = useState('daily');
  const [theme, setTheme] = useState('dark');
  const audioContextRef = useRef(null);
  const isDark = theme === 'dark';
  const requiredPickCount = topic === 'monthly' ? 10 : 1;
  const isSelectionComplete = selectedCards.length === requiredPickCount;

  const READING_TOPICS = [
    { id: 'daily', label: 'รายวัน', icon: '🌅' },
    { id: 'monthly', label: 'รายเดือน', icon: '📅' },
    { id: 'love', label: 'ความรัก', icon: '❤️' },
    { id: 'work', label: 'การงาน/เรียน', icon: '📚' },
    { id: 'finance', label: 'การเงิน', icon: '💰' },
    { id: 'health', label: 'สุขภาพ', icon: '🌿' },
    { id: 'social', label: 'บริวาร', icon: '👥' },
    { id: 'luck', label: 'โชคลาภ', icon: '🍀' },
  ];

  // Load Google AdSense Script once on mount
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6454901300191005";
    script.async = true;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const resetGame = () => {
    setGameState('MENU');
    setSelectedCards([]);
    setRevealedIndices([]);
    // Do not reset topic/reading type so user preference persists
  };

  const startReading = () => {
    if (topic === 'daily') {
      setGameState('SHUFFLING');
    } else {
      setGameState('SHUFFLING');
    }
  };

  const onShuffleComplete = () => {
    // Determine which cards to include in the deck
    const baseDeck = topic === 'love' ? TAROT_CARDS.slice(0, 22) : TAROT_CARDS;

    // Shuffle the determined deck for dragging/picking
    const shuffledDeck = [...baseDeck].sort(() => 0.5 - Math.random());
    setDeck(shuffledDeck);

    if (topic === 'daily' || topic === 'monthly' || topic === 'love') {
      setGameState('PICKING');
    } else {
      drawCards();
    }
  };

  const handleCardPick = (card) => {
    // If already picked, ignore
    if (selectedCards.some(c => c.id === card.id)) return;
    if (selectedCards.length >= requiredPickCount) return;

    playRevealSound();
    setSelectedCards(prev => {
      if (prev.length >= requiredPickCount) return prev;
      if (prev.some(c => c.id === card.id)) return prev;
      return [...prev, card];
    });
  };

  const confirmReading = () => {
    if (!isSelectionComplete) return;

    setGameState('RESULT');

    if (topic === 'monthly') {
      setRevealedIndices([]);
      selectedCards.forEach((_, idx) => {
        setTimeout(() => {
          setRevealedIndices(prev => [...prev, idx]);
        }, idx * 200);
      });
    } else {
      setRevealedIndices([0]);
    }
  };

  const drawCards = () => {
    setIsRevealing(true);
    setSelectedCards([]);
    setRevealedIndices([]);

    setTimeout(() => {
      const baseDeck = topic === 'love' ? TAROT_CARDS.slice(0, 22) : TAROT_CARDS;
      const shuffled = [...baseDeck].sort(() => 0.5 - Math.random());
      const numToDraw = readingType === '3-cards' ? 3 : 1;
      setSelectedCards(shuffled.slice(0, numToDraw));
      setIsRevealing(false);
    }, 800);
  };



  const manualShuffle = () => {
    playRevealSound();
    setSelectedCards([]); // Reset selection if shuffling manually
    setGameState('SHUFFLING');
  };

  const manualCut = () => {
    playRevealSound();
    setSelectedCards([]); // Reset selection if cutting manually
    setGameState('CUTTING');
  };

  const onCutComplete = () => {
    const cutPoint = Math.floor(deck.length / 2) + Math.floor(Math.random() * 10) - 5;
    const newDeck = [...deck.slice(cutPoint), ...deck.slice(0, cutPoint)];
    setDeck(newDeck);
    setGameState('PICKING');
  };

  const playRevealSound = () => {
    if (typeof window === 'undefined') return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Create White Noise Buffer
    const bufferSize = ctx.sampleRate * 0.1; // 0.1 seconds
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    // Nodes
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, ctx.currentTime);

    const gainNode = ctx.createGain();

    // Envelope for "Swish" sound
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01); // Attack
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08); // Decay

    // Connect
    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Play
    noiseSource.start();
  };

  const toggleCard = (index) => {
    if (revealedIndices.includes(index)) return;
    playRevealSound();
    setRevealedIndices(prev => [...prev, index]);
  };

  const getPositionLabel = (index) => {
    const topicLabel = READING_TOPICS.find(t => t.id === topic)?.label || '';

    if (readingType === '1-card' || topic === 'daily') {
      return `คำทำนาย${topicLabel}`;
    }

    const timeframes = ['อดีต/พื้นฐาน', 'ปัจจุบัน/สถานการณ์', 'อนาคต/บทสรุป'];
    return `${timeframes[index]} (${topicLabel})`;
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <nav className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 max-w-6xl mx-auto z-50 relative">
        <div className="flex items-center gap-2 text-xl sm:text-2xl font-serif font-bold tracking-wider cursor-pointer" onClick={resetGame}>
          <Sparkles className="text-purple-500" />
          <span>TAROT ORACLE</span>
        </div>
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className={`self-start sm:self-auto p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-800/20' : 'hover:bg-slate-200'}`}
        >
          {isDark ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col items-center min-h-[80vh]">

        {/* MENU STATE */}
        {gameState === 'MENU' && (
          <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="text-center mb-10 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-3 sm:mb-4">ค้นหาคำตอบจากจิตวิญญาณ</h1>
              <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto">
                ตั้งจิตอธิษฐานถึงเรื่องที่ต้องการทราบ แล้วเลือกหัวข้อเพื่อเริ่มทำนาย
              </p>
            </header>

            {/* Topic Selection */}
            <div className="w-full max-w-3xl mx-auto mb-8">
              <h2 className="text-center text-sm uppercase tracking-widest text-slate-500 mb-4">เลือกหัวข้อคำทำนาย</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {READING_TOPICS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTopic(t.id)}
                    className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2 ${topic === t.id
                      ? 'bg-purple-900/30 border-purple-500 text-purple-200 shadow-lg shadow-purple-900/20 scale-105'
                      : isDark ? 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    <span className="text-2xl">{t.icon}</span>
                    <span className="text-sm font-medium">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Reading Type Selection (Hidden for Daily, Monthly, and Love) */}
            {topic !== 'daily' && topic !== 'monthly' && topic !== 'love' && (
              <div className="w-full flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-10">
                <button
                  onClick={() => setReadingType('3-cards')}
                  className={`px-6 py-2 rounded-full border transition-all ${readingType === '3-cards' ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20' : isDark ? 'border-slate-700 text-slate-200 hover:bg-slate-800/40' : 'border-slate-300 text-slate-700 hover:bg-slate-200/70'}`}
                >
                  แบบ 3 ใบ
                </button>
                <button
                  onClick={() => setReadingType('1-card')}
                  className={`px-6 py-2 rounded-full border transition-all ${readingType === '1-card' ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20' : isDark ? 'border-slate-700 text-slate-200 hover:bg-slate-800/40' : 'border-slate-300 text-slate-700 hover:bg-slate-200/70'}`}
                >
                  ใบเดียว
                </button>
              </div>
            )}

            {/* Start Button */}
            <button
              onClick={startReading}
              className="group relative w-full sm:w-auto px-10 sm:px-16 py-4 sm:py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-bold text-lg sm:text-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-purple-500/20"
            >
              เริ่มต้นทำนาย
            </button>



            <GoogleAdSlot className="mt-12" />
          </div>
        )}

        {/* SHUFFLING STATE */}
        {gameState === 'SHUFFLING' && (
          <div className="w-full flex flex-col items-center justify-center min-h-[50vh] animate-in fade-in zoom-in duration-500">
            <h2 className="text-2xl sm:text-3xl font-serif mb-12 text-center animate-pulse text-purple-300">
              กำลังสับไพ่... จงตั้งจิตอธิษฐาน
            </h2>
            <ShuffleAnimation onComplete={onShuffleComplete} />
          </div>
        )}

        {/* CUTTING STATE */}
        {gameState === 'CUTTING' && (
          <div className="w-full flex flex-col items-center justify-center min-h-[50vh] animate-in fade-in zoom-in duration-500">
            <h2 className="text-2xl sm:text-3xl font-serif mb-12 text-center animate-pulse text-yellow-300">
              กำลังตัดไพ่...
            </h2>
            <CuttingAnimation onComplete={onCutComplete} />
          </div>
        )}

        {/* PICKING STATE */}
        {gameState === 'PICKING' && (
          <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <h2 className="text-2xl sm:text-3xl font-serif mb-4 text-center">
              {topic === 'monthly'
                ? 'เลือกไพ่ 10 ใบ'
                : 'เลือกไพ่ 1 ใบที่ดึงดูดใจคุณที่สุด'}
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              เลือกแล้ว {selectedCards.length}/{requiredPickCount}
            </p>

            {/* Controls */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={manualShuffle}
                className="flex items-center gap-2 px-6 py-2 rounded-full border border-purple-500/50 bg-purple-900/20 text-purple-200 hover:bg-purple-900/40 transition-colors"
              >
                <RefreshCw size={18} /> สับไพ่
              </button>
              <button
                onClick={manualCut}
                className="flex items-center gap-2 px-6 py-2 rounded-full border border-yellow-500/50 bg-yellow-900/20 text-yellow-200 hover:bg-yellow-900/40 transition-colors"
              >
                <div className="rotate-90"><Maximize2 size={18} /></div> ตัดไพ่
              </button>
            </div>

            <div className="w-full max-w-5xl mx-auto px-4 pb-12">
              <div className="grid grid-cols-10 gap-y-8 sm:gap-y-12 justify-items-center">
                {deck.map((card, i) => (
                  <div
                    key={card.id}
                    onClick={() => handleCardPick(card)}
                    className="relative w-20 h-[120px] sm:w-32 sm:h-[208px] md:w-36 md:h-[234px] cursor-pointer transition-all hover:-translate-y-4 hover:scale-110 hover:z-20"
                    style={{
                      zIndex: i,
                      // Apply negative margin to overlap except for the first card in each row
                      marginLeft: i % 10 === 0 ? 0 : '-50%',
                      animation: 'dealCard 0.4s ease-out backwards',
                      animationDelay: `${i * 15}ms`
                    }}
                  >
                    <div className={`w-full h-full shadow-lg rounded-xl overflow-hidden transition-opacity duration-300 ${selectedCards.some(c => c.id === card.id) ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                      <CardBack />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-col items-center gap-3">
              <button
                onClick={confirmReading}
                disabled={!isSelectionComplete}
                className={`px-8 py-3 rounded-full font-medium transition-all ${isSelectionComplete
                  ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-slate-800/60 text-slate-500 cursor-not-allowed'}`}
              >
                ยืนยันการทำนาย
              </button>
              {!isSelectionComplete && (
                <p className="text-xs text-slate-500">
                  เลือกให้ครบ {requiredPickCount} ใบเพื่อยืนยัน
                </p>
              )}
            </div>

            <button onClick={resetGame} className="mt-12 flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft size={20} /> ย้อนกลับ
            </button>
          </div>
        )}



        {/* MONTHLY RESULT STATE (GRID LAYOUT) */}
        {gameState === 'RESULT' && selectedCards.length > 0 && topic === 'monthly' && (
          <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-6xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-serif text-yellow-500 mb-2">คำทำนายรายเดือน</h2>
              <p className="text-slate-400 text-sm">ภาพรวมตลอดเดือนของคุณ</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full mb-12">
              {selectedCards.map((card, idx) => (
                <div key={card.id} className="flex flex-col items-center gap-2 animate-in zoom-in duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-lg shadow-purple-900/40">
                    <img src={card.img} alt={card.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-yellow-500/70 font-mono mb-1">ใบที่ {idx + 1}</div>
                    <h4 className="text-xs sm:text-sm font-bold text-yellow-100 leading-tight">{card.name}</h4>
                    <div className="text-[10px] text-slate-400">({card.nameThai})</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Interpretation List */}
            <div className="w-full max-w-4xl space-y-6 bg-slate-900/30 p-6 md:p-8 rounded-2xl">
              <h3 className="text-xl font-serif text-center mb-6 text-purple-300">ความหมายของไพ่แต่ละใบ</h3>
              <div className="grid grid-cols-1 gap-6">
                {selectedCards.map((card, idx) => (
                  <div key={card.id} className="flex gap-4 border-b border-slate-800/50 pb-4 last:border-0 last:pb-0">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-purple-900/30 flex items-center justify-center text-sm font-bold text-purple-300">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-bold text-yellow-500">{card.name}</span>
                        <span className="text-sm text-slate-400">({card.nameThai})</span>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">{card.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 flex justify-center">
              <button
                onClick={resetGame}
                className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-medium transition-all"
              >
                กลับหน้าหลัก
              </button>
            </div>

            <GoogleAdSlot className="mt-16" />
          </div>
        )}

        {/* SINGLE CARD RESULT STATE (ORIGINAL LAYOUT) - ONLY SHOW IF NOT MONTHLY */}
        {gameState === 'RESULT' && selectedCards.length > 0 && topic !== 'monthly' && (
          <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <span className="px-4 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm tracking-wider uppercase">
                {getPositionLabel(0)}
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              {/* Big Card Display */}
              <div className="relative w-72 h-[432px] sm:w-[300px] sm:h-[540px] preserve-3d animate-in zoom-in duration-700">
                <div className="absolute inset-0 bg-slate-950 rounded-3xl overflow-hidden shadow-2xl shadow-purple-900/50">
                  <img
                    src={selectedCards[0].img}
                    alt={selectedCards[0].name}
                    className="w-full h-full object-contain"
                  />
                  {/* Subtle gradient overlay to ensure border distinctness if needed */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                </div>
              </div>

              {/* Details / Interpretation Text Area */}
              <div className="flex-1 text-center md:text-left space-y-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold flex flex-wrap items-center justify-center md:justify-start gap-2 text-yellow-500">
                    <Sparkles className="text-yellow-500" />
                    <span>{selectedCards[0].name}</span>
                    <span className="text-lg text-yellow-200/80 font-normal">({selectedCards[0].nameThai})</span>
                  </h3>
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent"></div>
                  <p className="text-slate-300 leading-relaxed text-lg">
                    <span className="font-bold text-yellow-100">ความหมาย:</span> {selectedCards[0].description}
                  </p>
                  <div className="p-4 rounded-lg bg-slate-800/40">
                    <p className="text-sm text-slate-400">
                      * คำทำนายเป็นเพียงแนวทาง การพิจารณาและตัดสินใจอยู่ที่ตัวคุณเอง
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                  <button
                    onClick={resetGame}
                    className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-medium transition-all"
                  >
                    กลับหน้าหลัก
                  </button>
                </div>
              </div>
            </div>

            <GoogleAdSlot className="mt-16" />
          </div>
        )}

      </main>

      {/* Footer only on menu or simplified */}
      {gameState === 'MENU' && (
        <footer className="mt-16 sm:mt-20 border-t border-slate-800/50 py-8 sm:py-10 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-bold justify-center md:justify-start">
                <Info size={18} className="text-purple-500" />
                วิธีใช้งาน
              </h4>
              <p className="text-sm text-slate-500">เลือกหัวข้อที่ต้องการ และเลือกไพ่ด้วยสัญชาตญาณของคุณ</p>
            </div>
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-bold justify-center md:justify-start">
                <History size={18} className="text-purple-500" />
                พลังของดวงจันทร์
              </h4>
              <p className="text-sm text-slate-500">จันทร์เสี้ยวเป็นสัญลักษณ์ของสัญชาตญาณและการเติบโตที่กำลังจะมาถึง</p>
            </div>
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-bold justify-center md:justify-start">
                <Sparkles size={18} className="text-purple-500" />
                คำแนะนำ
              </h4>
              <p className="text-sm text-slate-500">จงใช้สติในการรับคำทำนาย และให้ไพ่เป็นเพียงกระจกสะท้อนความคิดภายในใจ</p>
            </div>
          </div>
        </footer>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        /* Shuffle Animation Keyframes */
        @keyframes shuffleCard {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(-40px) rotate(-5deg); }
          50% { transform: translateX(0) rotate(0deg); }
          75% { transform: translateX(40px) rotate(5deg); }
        }
        /* Dealing Animation Keyframes */
        @keyframes dealCard {
          0% { opacity: 0; transform: translateY(100px) scale(0.5); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        /* Cutting Animation Keyframes */
        @keyframes cutTop {
          0% { transform: translate(0, 0); z-index: 20; }
          30% { transform: translate(60%, 0); z-index: 20; }
          50% { transform: translate(60%, 10%); z-index: 5; }
          75% { transform: translate(0, 10%); z-index: 5; }
          100% { transform: translate(0, 4px); z-index: 5; }
        }
        @keyframes cutBottom {
          0% { transform: translate(0, 0); z-index: 10; }
          30% { transform: translate(-10%, 0); z-index: 10; }
          50% { transform: translate(-10%, -10%); z-index: 15; }
          75% { transform: translate(0, -10%); z-index: 15; }
          100% { transform: translate(0, -4px); z-index: 15; }
        }
      `}} />
    </div>
  );
};

export default App;
