import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, Database } from 'lucide-react';
import { usePageSEO } from '../hooks/usePageTitle';

const PrivacyPolicyPage = ({ isDark = true }) => {
  const navigate = useNavigate();

  usePageSEO({
    title: 'นโยบายความเป็นส่วนตัว - ศาสตร์ดวงดาว',
    description: 'นโยบายความเป็นส่วนตัวของเว็บไซต์ดูดวงออนไลน์ศาสตร์ดวงดาว การจัดการข้อมูลส่วนบุคคล',
    path: '/privacy-policy',
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
                นโยบายความเป็นส่วนตัว
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
              <Shield className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <h2 className={`text-xl font-bold ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>
                คำนำ
              </h2>
            </div>
            <p className={`${isDark ? 'text-stone-300' : 'text-stone-600'} leading-relaxed mb-4`}>
              ที่เว็บไซต์ศาสตร์ดวงดาว เราให้ความสำคัญกับความเป็นส่วนตัวของคุณเป็นอย่างยิ่ง นโยบายฉบับนี้อธิบายถึงวิธีที่เราเก็บ ใช้ และปกป้องข้อมูลส่วนบุคคลของคุณเมื่อใช้บริการของเรา
            </p>
            <p className={`${isDark ? 'text-stone-300' : 'text-stone-600'} leading-relaxed`}>
              การใช้บริการของเราถือว่าคุณได้อ่านและยอมรับนโยบายความเป็นส่วนตัวนี้
            </p>
          </div>

          {/* Data Collection */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Database className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <h2 className={`text-xl font-bold ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>
                ข้อมูลที่เราเก็บรวบรวม
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${isDark ? 'bg-stone-700' : 'bg-stone-50'}`}>
                <h3 className={`font-semibold ${isDark ? 'text-stone-200' : 'text-stone-700'} mb-2`}>
                  ข้อมูลบัญชีผู้ใช้
                </h3>
                <ul className={`list-disc list-inside ${isDark ? 'text-stone-300' : 'text-stone-600'} space-y-1`}>
                  <li>ชื่อและอีเมล (จาก Google/LINE)</li>
                  <li>รูปโปรไฟล์</li>
                  <li>ประวัติการดูดวง</li>
                  <li>เครดิตคงเหลือและธุรกรรม</li>
                </ul>
              </div>

              <div className={`p-4 rounded-lg ${isDark ? 'bg-stone-700' : 'bg-stone-50'}`}>
                <h3 className={`font-semibold ${isDark ? 'text-stone-200' : 'text-stone-700'} mb-2`}>
                  ข้อมูลการใช้งาน
                </h3>
                <ul className={`list-disc list-inside ${isDark ? 'text-stone-300' : 'text-stone-600'} space-y-1`}>
                  <li>ประเภทการดูดวงที่เลือก</li>
                  <li>เวลาและวันที่ใช้บริการ</li>
                  <li>ข้อมูลสถิติการใช้งาน</li>
                  <li>Cookies และข้อมูลเทคนิคอื่นๆ</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Usage */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Eye className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              <h2 className={`text-xl font-bold ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>
                การใช้ข้อมูล
              </h2>
            </div>
            
            <div className="space-y-3">
              <div className={`p-3 rounded-lg ${isDark ? 'bg-stone-700' : 'bg-stone-50'}`}>
                <p className={`${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                  📊 <strong>การพัฒนาบริการ:</strong> ปรับปรุงและพัฒนาคุณภาพของบริการดูดวง
                </p>
              </div>
              <div className={`p-3 rounded-lg ${isDark ? 'bg-stone-700' : 'bg-stone-50'}`}>
                <p className={`${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                  🎯 <strong>การปรับแต่งประสบการณ์:</strong> แสดงเนื้อหาที่เหมาะสมกับคุณ
                </p>
              </div>
              <div className={`p-3 rounded-lg ${isDark ? 'bg-stone-700' : 'bg-stone-50'}`}>
                <p className={`${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                  💳 <strong>การจัดการบริการ:</strong> จัดการเครดิตและธุรกรรมการชำระเงิน
                </p>
              </div>
              <div className={`p-3 rounded-lg ${isDark ? 'bg-stone-700' : 'bg-stone-50'}`}>
                <p className={`${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                  📈 <strong>การวิเคราะห์:</strong> วิเคราะห์พฤติกรรมการใช้งานเพื่อปรับปรุงบริการ
                </p>
              </div>
            </div>
          </div>

          {/* Data Protection */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Lock className={`w-6 h-6 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
              <h2 className={`text-xl font-bold ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>
                การปกป้องข้อมูล
              </h2>
            </div>
            
            <div className="space-y-3">
              <p className={`${isDark ? 'text-stone-300' : 'text-stone-600'} leading-relaxed`}>
                เราใช้มาตรการรักษาความปลอดภัยต่อไปนี้เพื่อปกป้องข้อมูลของคุณ:
              </p>
              <ul className={`list-disc list-inside ${isDark ? 'text-stone-300' : 'text-stone-600'} space-y-2 ml-4`}>
                <li>การเข้ารหัสข้อมูล (Encryption) ในระดับ SSL/TLS</li>
                <li>การจำกัดการเข้าถึงข้อมูลสำหรับบุคลากรที่เกี่ยวข้องเท่านั้น</li>
                <li>การอัปเดตระบบความปลอดภัยอย่างสม่ำเสมอ</li>
                <li>การสำรองข้อมูลเพื่อป้องกันการสูญหาย</li>
                <li>การไม่เปิดเผยข้อมูลให้บุคคลภายนอกโดยไม่ได้รับอนุญาต</li>
              </ul>
            </div>
          </div>

          {/* User Rights */}
          <div className="mb-8">
            <h2 className={`text-xl font-bold ${isDark ? 'text-stone-100' : 'text-stone-800'} mb-4`}>
              สิทธิของผู้ใช้
            </h2>
            
            <div className="space-y-3">
              <div className={`p-3 rounded-lg ${isDark ? 'bg-stone-700' : 'bg-stone-50'}`}>
                <p className={`${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                  👁️ <strong>สิทธิในการเข้าถึง:</strong> คุณสามารถดูข้อมูลส่วนตัวที่เราเก็บไว้ได้
                </p>
              </div>
              <div className={`p-3 rounded-lg ${isDark ? 'bg-stone-700' : 'bg-stone-50'}`}>
                <p className={`${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                  ✏️ <strong>สิทธิในการแก้ไข:</strong> คุณสามารถแก้ไขข้อมูลส่วนตัวได้
                </p>
              </div>
              <div className={`p-3 rounded-lg ${isDark ? 'bg-stone-700' : 'bg-stone-50'}`}>
                <p className={`${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                  🗑️ <strong>สิทธิในการลบ:</strong> คุณสามารถขอลบบัญชีและข้อมูลได้
                </p>
              </div>
              <div className={`p-3 rounded-lg ${isDark ? 'bg-stone-700' : 'bg-stone-50'}`}>
                <p className={`${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                  🚫 <strong>สิทธิในการคัดค้าน:</strong> คุณสามารถคัดค้านการใช้ข้อมูลได้
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="mb-8">
            <h2 className={`text-xl font-bold ${isDark ? 'text-stone-100' : 'text-stone-800'} mb-4`}>
              ติดต่อเรา
            </h2>
            
            <div className={`p-4 rounded-lg ${isDark ? 'bg-stone-700' : 'bg-stone-50'}`}>
              <p className={`${isDark ? 'text-stone-300' : 'text-stone-600'} leading-relaxed`}>
                หากคุณมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัวหรือต้องการใช้สิทธิของคุณ สามารถติดต่อเราได้ที่:
              </p>
              <div className="mt-3 space-y-2">
                <p className={`${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                  📧 Email: privacy@satduangdao.com
                </p>
                <p className={`${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                  🌐 Website: www.satduangdao.com
                </p>
              </div>
            </div>
          </div>

          {/* Update Notice */}
          <div className={`mt-8 p-4 rounded-lg ${isDark ? 'bg-amber-900/20 border-amber-700' : 'bg-amber-50 border-amber-200'} border`}>
            <p className={`text-sm ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
              ⚠️ เราอาจอัปเดตนโยบายความเป็นส่วนตัวนี้เป็นครั้งคราว การเปลี่ยนแปลงจะมีผลบังคับใช้ทันทีหลังจากเผยแพร่บนเว็บไซต์
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicyPage;
