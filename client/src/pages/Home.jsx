import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Book, Music, CheckCircle } from 'lucide-react'

export default function Home() {
  return (
    <div className="p-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Book /> 스토리보드 만들기</CardTitle>
        </CardHeader>
        <CardContent>
          <Button>이동하기</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Music /> 사운드 배치하기</CardTitle>
        </CardHeader>
        <CardContent>
          <Button>이동하기</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><CheckCircle /> 최종 확인하기</CardTitle>
        </CardHeader>
        <CardContent>
          <Button>이동하기</Button>
        </CardContent>
      </Card>
    </div>
  )
}