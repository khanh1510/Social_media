import type { Metadata } from 'next'
import { Box, Container, Typography, Divider } from '@mui/material'

export const metadata: Metadata = {
  title: 'Điều khoản sử dụng | SocialBoost VN',
  description: 'Điều khoản sử dụng dịch vụ SocialBoost VN',
}

const sections = [
  {
    title: '1. Chấp nhận điều khoản',
    content: 'Khi sử dụng dịch vụ của SocialBoost VN, bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và điều kiện sau đây. Nếu bạn không đồng ý với bất kỳ phần nào của điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.',
  },
  {
    title: '2. Mô tả dịch vụ',
    content: 'SocialBoost VN cung cấp các dịch vụ tăng tương tác mạng xã hội bao gồm tăng followers, likes, views, comments và các chỉ số tương tác khác trên các nền tảng Instagram, TikTok, YouTube và Facebook. Chúng tôi cam kết chỉ sử dụng các phương pháp hợp pháp và an toàn.',
  },
  {
    title: '3. Điều kiện sử dụng',
    content: 'Bạn phải từ 16 tuổi trở lên để sử dụng dịch vụ. Bạn chịu trách nhiệm bảo mật tài khoản và mật khẩu của mình. Bạn không được sử dụng dịch vụ cho các mục đích bất hợp pháp hoặc vi phạm chính sách của các nền tảng mạng xã hội.',
  },
  {
    title: '4. Thanh toán và hoàn tiền',
    content: 'Tất cả giao dịch được xử lý an toàn qua các cổng thanh toán được chứng nhận. Chúng tôi cam kết hoàn tiền 100% nếu dịch vụ không được thực hiện đúng như cam kết trong vòng 72 giờ kể từ khi đặt hàng.',
  },
  {
    title: '5. Bảo hành dịch vụ',
    content: 'Mọi gói dịch vụ đều được bảo hành trong 30 ngày. Trong trường hợp số lượng tương tác giảm xuống dưới mức đã đặt mua, chúng tôi sẽ bù đắp miễn phí. Bảo hành không áp dụng nếu tài khoản vi phạm chính sách của nền tảng.',
  },
  {
    title: '6. Giới hạn trách nhiệm',
    content: 'SocialBoost VN không chịu trách nhiệm về bất kỳ thiệt hại gián tiếp nào phát sinh từ việc sử dụng dịch vụ. Trách nhiệm tối đa của chúng tôi giới hạn ở số tiền bạn đã thanh toán cho dịch vụ cụ thể.',
  },
  {
    title: '7. Quyền riêng tư',
    content: 'Chúng tôi thu thập và xử lý dữ liệu cá nhân theo Chính sách Bảo mật của SocialBoost VN. Chúng tôi không bán hoặc chia sẻ thông tin cá nhân của bạn với bên thứ ba mà không có sự đồng ý của bạn.',
  },
  {
    title: '8. Thay đổi điều khoản',
    content: 'SocialBoost VN có quyền thay đổi điều khoản sử dụng bất cứ lúc nào. Chúng tôi sẽ thông báo về các thay đổi quan trọng qua email đăng ký. Việc tiếp tục sử dụng dịch vụ sau khi thay đổi được áp dụng đồng nghĩa với việc bạn chấp nhận điều khoản mới.',
  },
  {
    title: '9. Liên hệ',
    content: 'Nếu có bất kỳ câu hỏi nào về điều khoản sử dụng, vui lòng liên hệ với chúng tôi qua email support@socialboost.vn hoặc hotline 1800 1234.',
  },
]

export default function TermsPage() {
  return (
    <Box sx={{ backgroundColor: '#F8F9FA', minHeight: '70vh', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 6 }}>
          <Typography variant="h1" sx={{ mb: 1.5, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
            Điều khoản sử dụng
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Cập nhật lần cuối: 01/01/2025
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {sections.map((s, i) => (
            <Box key={i}>
              <Typography variant="h3" sx={{ mb: 1.5, fontSize: '1.125rem' }}>{s.title}</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>{s.content}</Typography>
              {i < sections.length - 1 && <Divider sx={{ mt: 4 }} />}
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  )
}
