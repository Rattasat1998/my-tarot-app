import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, AlertCircle, CheckCircle, Gavel } from 'lucide-react';
import { usePageSEO } from '../hooks/usePageTitle';

const TermsOfServicePage = ({ isDark = true }) => {
  const navigate = useNavigate();

  usePageSEO({
    title: 'เงื่อนไขการใช้งาน - ศาสตร์ดวงดาว',
    description: 'เงื่อนไขและข้อกำหนดการใช้บริการเว็บไซต์ดูดวงออนไลน์ศาสตร์ดวงดาว',
    path: '/terms-of-service',
    type: 'website'
  });

  return (
    <div className={`min-h-screen ${isDark ? 'bg-stone-900' : 'bg-stone-50'} transition-colors duration-300`}>
      {/* Header */}
      <header className={`w-full ${isDark ? 'bg-stone-800' : 'bg-white'} shadow-lg py-6 sticky top-0 z-10`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className={`p-2 rounded-lg ${isDark ? 'hover:bg-stone-700' : 'hover:bg-stone-100'} transition-colors`}
            >
              <ArrowLeft className={`w-5 h-5 ${isDark ? 'text-stone-300' : 'text-stone-600'}`} />
            </button>
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>
                เงื่อนไขการใช้งาน
              </h1>
              <p className={`text-sm ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                ปรับปรุงล่าสุด: 24 กุมภาพันธ์ 2026
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className={`${isDark ? 'bg-stone-800' : 'bg-white'} rounded-xl shadow-lg p-8`}>
          
          {/* Introduction */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <h2 className={`text-xl font-bold ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>
                คำนำ
              </h2>
            </div>
            <p className={`${isDark ? 'text-stone-300' : 'text-stone-600'} leading-relaxed mb-4`}>
              ยินดีต้อนรับสู่เว็บไซต์ศาสตร์ดวงดาว เงื่อนไขการใช้งานฉบับนี้กำหนดข้อตกลงและเงื่อนไขในการใช้บริการของเรา
            </p>
            <p className={`${isDark ? 'text-stone-300' : 'text-stone-600'} leading-relaxed`}>
              การเข้าถึงและใช้บริการของเราถือว่าคุณยอมรับและตกลงที่จะผูกพันกับเงื่อนไขเหล่านี้
            </p>
          </div>

          {/* Service Description */}
          <div className="mb-8">
            <h2 className={`text-xl font-bold ${isDark ? 'text-stone-100' : 'text-stone-800'} mb-4`}>
              บริการของเรา
            </h2>
            
            <div className="space-y-3">
              <div className={`p-4 rounded-lg ${isDark ? 'bg-stone-700' : 'bg-stone-50'}`}>
                <h3 className={`font-semibold ${isDark ? 'text-stone-200' : 'text-stone-700'} mb-2`}>
                  🔮 บริการดูดวง
                </h3>
                <ul className={`list-disc list-inside ${isDark ? 'text-stone-300' : 'text-stone-600'} space-y-1`}>
                  <li>ดูดวงไพ่ทาโรต์ (1 ใบ, 3 ใบ, 6 ใบ, 12 ใบ)</li>
                  <li>ดูดวงรายวันและรายเดือน</li>
                  <li>ดวง 12 ราศี</li>
                  <li>ดูดวงเนื้อคู่และความรัก</li>
                  <li>ดูดวงรูนโบราณ</li>
                  <li>วิเคราะห์หวยและเลขมงคล</li>
                </ul>
              </div>

              <div className={`p-4 rounded-lg ${isDark ? 'bg-stone-700' : 'bg-stone-50'}`}>
                <h3 className={`font-semibold ${isDark ? 'text-stone-200' : 'text-stone-700'} mb-2`}>
                  💳 ระบบเครดิต
                </h3>
                <ul className={`list-disc list-inside ${isDark ? 'text-stone-300' : 'text-stone-600'} space-y-1`}>
                  <li>ซื้อเครดิตเพื่อใช้บริการต่างๆ</li>
                  <li>สมาชิกพรีเมียมรับเครดิตไม่จำกัด</li>
                  <li>โปรโมชั่นและของรางวัลพิเศษ</li>
                </ul>
              </div>
            </div>
          </div>

          {/* User Responsibilities */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              <h2 className={`text-xl font-bold ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>
                ความรับผิดชอบของผู้ใช้
              </h2>
            </div>
            
            <div className="space-y-3">
              <div className={`p-3 rounded-lg ${isDark ? 'bg-stone-700' : 'bg-stone-50'}`}>
                <p className={`${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                  📝 <strong>ข้อมูลที่ถูกต้อง:</strong> ให้ข้อมูลส่วนตัวที่ถูกต้องและเป็นปัจจุบัน
                </p>
              </div>
              <div className={`p-3 rounded-lg ${isDark ? 'bg-stone-700' : 'bg-stone-50'}`}>
                <p className={`${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                  🔐 <strong>ความปลอดภัย:</strong> รักษาความปลอดภัยของบัญชีผู้ใช้ของคุณ
                </p>
              </div>
              <div className={`p-3 rounded-lg ${isDark ? 'bg-stone-700' : 'bg-stone-50'}`}>
                <p className={`${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                  📵 <strong>การใช้งาน:</strong> ใช้บริการตามวัตถุประสงค์ที่กำหนด
                </p>
              </div>
              <div className={`p-3 rounded-lg ${isDark ? 'bg-stone-700' : 'bg-stone-50'}`}>
                <p className={`${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                  💰 <strong>การชำระเงิน:</strong> ชำระค่าบริการตามที่กำหนด
                </p>
              </div>
            </div>
          </div>

          {/* Prohibited Activities */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className={`w-6 h-6 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
              <h2 className={`text-xl font-bold ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>
                การกระทำที่ห้าม
              </h2>
            </div>
            
            <div className="space-y-3">
              <ul className={`list-disc list-inside ${isDark ? 'text-stone-300' : 'text-stone-600'} space-y-2`}>
                <li>การใช้บริการเพื่อกิจกรรมที่ผิดกฎหมาย</li>
                <li>การแอบอ้างตัวตนของผู้อื่น</li>
                <li>การพยายามเจาะระบบหรือทำลายข้อมูล</li>
                <li>การเผยแพร่เนื้อหาที่เป็นการหมิ่นเหมิดหรือไม่เหมาะสม</li>
                <li>การคัดลอก ดัดแปลง หรือจำหน่ายเนื้อหาโดยไม่ได้รับอนุญาต</li>
                <li>การใช้บริการเพื่อการหลอกลวงหรือฉ้อโกง</li>
              </ul>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="mb-8">
            <h2 className={`text-xl font-bold ${isDark ? 'text-stone-100' : 'text-stone-800'} mb-4`}>
              เงื่อนไขการชำระเงิน
            </h2>
            
            <div className="space-y-3">
              <div className={`p-4 rounded-lg ${isDark ? 'bg-stone-700' : 'bg-stone-50'}`}>
                <h3 className={`font-semibold ${isDark ? 'text-stone-200' : 'text-stone-700'} mb-2`}>
                  💳 การซื้อเครดิต
                </h3>
                <ul className={`list-disc list-inside ${isDark ? 'text-stone-300' : 'text-stone-600'} space-y-1`}>
                  <li>เครดิตสามารถซื้อผ่านช่องทางที่เรากำหนด</li>
                  <li>ราคาอาจมีการเปลี่ยนแปลงโดยแจ้งให้ทราบล่วงหน้า</li>
                  <li>เครดิตที่ซื้อแล้วไม่สามารถคืนเงินได้</li>
                  <li>เครดิตมีอายุ 365 วันนับจากวันที่ซื้อ</li>
                </ul>
              </div>

              <div className={`p-4 rounded-lg ${isDark ? 'bg-stone-700' : 'bg-stone-50'}`}>
                <h3 className={`font-semibold ${isDark ? 'text-stone-200' : 'text-stone-700'} mb-2`}>
                  👑 สมาชิกพรีเมียม
                </h3>
                <ul className={`list-disc list-inside ${isDark ? 'text-stone-300' : 'text-stone-600'} space-y-1`}>
                  <li>สมัครสมาชิกรายเดือนหรือรายปี</li>
                  <li>ใช้บริการได้ไม่จำกัดระหว่างสมาชิก</li>
                  <li>สามารถยกเลิกได้ทุกเมื่อ</li>
                  <li>ไม่มีการคืนเงินสำหรับเดือนที่ใช้ไปแล้ว</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="mb-8">
            <h2 className={`text-xl font-bold ${isDark ? 'text-stone-100' : 'text-stone-800'} mb-4`}>
              ทรัพย์สินทางปัญญา
            </h2>
            
            <div className={`p-4 rounded-lg ${isDark ? 'bg-stone-700' : 'bg-stone-50'}`}>
              <p className={`${isDark ? 'text-stone-300' : 'text-stone-600'} leading-relaxed mb-3`}>
                เนื้อหาทั้งหมดบนเว็บไซต์ศาสตร์ดวงดาว รวมถึงข้อความ รูปภาพ กราฟิก โลโก้ และซอฟต์แวร์ เป็นทรัพย์สินทางปัญญาของเรา
              </p>
              <p className={`${isDark ? 'text-stone-300' : 'text-stone-600'} leading-relaxed`}>
                ห้ามคัดลอก ดัดแปลง แจกจ่าย หรือใช้เนื้อหาเพื่อวัตถุประสงค์พาณิชย์โดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษรจากเรา
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Gavel className={`w-6 h-6 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
              <h2 className={`text-xl font-bold ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>
                ข้อจำกัดความรับผิดชอบ
            </h2>
            </div>
            
            <div className={`p-4 rounded-lg ${isDark ? 'bg-amber-900/20 border-amber-700' : 'bg-amber-50 border-amber-200'} border`}>
              <p className={`text-sm ${isDark ? 'text-amber-300' : 'text-amber-800'} leading-relaxed mb-3`}>
                ⚠️ <strong>ข้อความสำคัญ:</strong>
              </p>
              <ul className={`list-disc list-inside ${isDark ? 'text-amber-200' : 'text-amber-700'} space-y-2 text-sm`}>
                <li>บริการดูดวงเป็นเพียงการให้คำแนะนำเพื่อความบันเทิงเท่านั้น</li>
                <li>ไม่สามารถใช้เป็นหลักฐานในการตัดสินใจที่สำคัญได้</li>
                <li>เราไม่รับประกันความแม่นยำของคำทำนาย</li>
                <li>ผู้ใช้ควรใช้วิจารณญาณในการตัดสินใจ</li>
                <li>เราไม่รับผิดชอบต่อความเสียหายใดๆ ที่เกิดจากการใช้บริการ</li>
              </ul>
            </div>
          </div>

          {/* Service Changes */}
          <div className="mb-8">
            <h2 className={`text-xl font-bold ${isDark ? 'text-stone-100' : 'text-stone-800'} mb-4`}>
              การเปลี่ยนแปลงบริการ
            </h2>
            
            <div className="space-y-3">
              <p className={`${isDark ? 'text-stone-300' : 'text-stone-600'} leading-relaxed`}>
                เรามีสิทธิที่จะ:
              </p>
              <ul className={`list-disc list-inside ${isDark ? 'text-stone-300' : 'text-stone-600'} space-y-2 ml-4`}>
                <li>ปรับปรุงหรือเปลี่ยนแปลงบริการโดยไม่ต้องแจ้งให้ทราบล่วงหน้า</li>
                <li>ระงับหรือยกเลิกบริการชั่วคราวหรือถาวร</li>
                <li>เปลี่ยนแปลงเงื่อนไขการใช้งานโดยแจ้งให้ทราบล่วงหน้า</li>
                <li>จำกัดการเข้าถึงบริการสำหรับผู้ที่ฝ่าฝืนเงื่อนไข</li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="mb-8">
            <h2 className={`text-xl font-bold ${isDark ? 'text-stone-100' : 'text-stone-800'} mb-4`}>
              ติดต่อเรา
            </h2>
            
            <div className={`p-4 rounded-lg ${isDark ? 'bg-stone-700' : 'bg-stone-50'}`}>
              <p className={`${isDark ? 'text-stone-300' : 'text-stone-600'} leading-relaxed`}>
                หากคุณมีคำถามเกี่ยวกับเงื่อนไขการใช้งาน สามารถติดต่อเราได้ที่:
              </p>
              <div className="mt-3 space-y-2">
                <p className={`${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                  📧 Email: support@satduangdao.com
                </p>
                <p className={`${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                  🌐 Website: www.satduangdao.com
                </p>
              </div>
            </div>
          </div>

          {/* Agreement */}
          <div className={`mt-8 p-4 rounded-lg ${isDark ? 'bg-purple-900/20 border-purple-700' : 'bg-purple-50 border-purple-200'} border`}>
            <p className={`text-sm ${isDark ? 'text-purple-300' : 'text-purple-800'}`}>
              📋 การใช้งานเว็บไซต์ศาสตร์ดวงดาวถือว่าคุณได้อ่าน เข้าใจ และยอมรับเงื่อนไขการใช้งานทั้งหมดนี้
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsOfServicePage;
