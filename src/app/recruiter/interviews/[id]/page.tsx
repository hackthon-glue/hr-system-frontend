'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { interviewService, Interview } from '@/lib/api/interviews';

interface QuestionAnswer {
  question: string;
  answer: string;
  questionType: string;
  difficulty: string;
  aiEvaluation?: {
    score: number;
    completeness: number;
    specificity: number;
    relevance: number;
    communication: number;
    strengths: string[];
    improvements: string[];
  };
}

export default function RecruiterInterviewDetailPage() {
  const router = useRouter();
  const params = useParams();
  const interviewId = parseInt(params.id as string);

  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState({
    technical_score: 0,
    communication_score: 0,
    cultural_fit_score: 0,
    overall_score: 0,
    notes: '',
    feedback: '',
    result: 'pending' as 'pending' | 'passed' | 'failed' | 'on_hold',
  });

  // Sample questions and answers (NOTE: In production, these should be fetched from backend API in English)
  const [questionsAnswers] = useState<QuestionAnswer[]>([
    {
      question: 'これまでの職務経験について教えてください。特に、チームでのプロジェクトにおける役割と成果を具体的に説明してください。',
      answer: '前職では5年間、バックエンドエンジニアとして勤務しました。主にPythonとDjangoを使用したWebアプリケーション開発を担当し、チームリーダーとして3名のメンバーを率いていました。最も大きな成果は、レガシーシステムのマイクロサービス化プロジェクトで、これにより処理速度が40%向上し、システムの保守性も大幅に改善しました。',
      questionType: 'experience',
      difficulty: 'medium',
      aiEvaluation: {
        score: 8.5,
        completeness: 9,
        specificity: 9,
        relevance: 8,
        communication: 8,
        strengths: [
          '具体的な数値（5年間、3名、40%向上）を示している',
          'リーダーシップ経験を明確に述べている',
          '技術スタックを具体的に説明している',
          '成果が定量的に示されている'
        ],
        improvements: [
          'プロジェクトの規模や期間をさらに詳しく説明すると良い',
          'チーム運営で直面した課題とその解決方法を追加すると説得力が増す'
        ]
      }
    },
    {
      question: '技術的な課題に直面した時、どのようにアプローチしますか？具体的な例を挙げて説明してください。',
      answer: 'パフォーマンス問題に直面した際は、まず問題の切り分けを行います。例えば、APIのレスポンスが遅い問題では、プロファイリングツールを使用してボトルネックを特定しました。データベースクエリのN+1問題が原因だったため、eager loadingを導入し、レスポンス時間を3秒から0.5秒に短縮できました。',
      questionType: 'technical',
      difficulty: 'medium',
      aiEvaluation: {
        score: 7.5,
        completeness: 8,
        specificity: 8,
        relevance: 7,
        communication: 7,
        strengths: [
          '問題解決のプロセスが明確',
          '具体的な技術用語（N+1問題、eager loading）を使用',
          '定量的な改善結果を示している'
        ],
        improvements: [
          'プロファイリングツールの具体名を挙げるとより良い',
          '他の選択肢を検討したかどうかの説明があると判断力が伝わる'
        ]
      }
    },
    {
      question: '当社のポジションに応募した理由と、5年後のキャリアビジョンを教えてください。',
      answer: '貴社のAI技術を活用した人事システム開発に強く魅力を感じました。私自身、HRテック領域に興味があり、技術で採用プロセスを革新したいと考えています。5年後は、テックリードとしてチームを率い、AI技術の導入だけでなく、エンジニアの育成にも貢献したいです。',
      questionType: 'motivation',
      difficulty: 'easy',
      aiEvaluation: {
        score: 7.0,
        completeness: 7,
        specificity: 7,
        relevance: 7,
        communication: 7,
        strengths: [
          '企業の事業内容を理解している',
          'キャリアビジョンが明確',
          '個人の興味と企業のミッションが一致している'
        ],
        improvements: [
          '具体的にどのようなAI技術に興味があるか深掘りすると良い',
          '貴社を選んだ他の理由（文化、チームなど）も述べると説得力が増す'
        ]
      }
    },
    {
      question: 'チームメンバーと意見が対立した時、どのように対処しますか？',
      answer: '実装方法について意見が分かれた際、まず相手の意見を十分に聞き、背景にある懸念を理解するよう努めます。その上で、双方のアプローチのメリット・デメリットを整理し、チーム全体で議論します。必要に応じてPoCを実施し、データに基づいて判断することを提案します。',
      questionType: 'behavioral',
      difficulty: 'medium',
      aiEvaluation: {
        score: 8.0,
        completeness: 8,
        specificity: 8,
        relevance: 8,
        communication: 8,
        strengths: [
          '傾聴の姿勢が示されている',
          '論理的なアプローチ（メリット・デメリット分析）',
          'データドリブンな意思決定を重視している',
          'チーム全体を巻き込む姿勢'
        ],
        improvements: [
          '実際の具体例があるとさらに説得力が増す',
          '妥協点を見つける際の優先順位付けの基準を述べると良い'
        ]
      }
    },
    {
      question: '最も誇りに思っているプロジェクトまたは成果について教えてください。その中であなたが果たした役割と、学んだことは何ですか？',
      answer: 'レガシーシステムのリプレースプロジェクトです。私はアーキテクチャ設計と実装のリードを担当しました。8ヶ月かけて完成させ、システムの安定性が向上し、新機能の開発速度も2倍になりました。この経験から、段階的な移行戦略の重要性と、ステークホルダーとの密なコミュニケーションの大切さを学びました。',
      questionType: 'achievement',
      difficulty: 'medium',
      aiEvaluation: {
        score: 8.5,
        completeness: 9,
        specificity: 9,
        relevance: 8,
        communication: 8,
        strengths: [
          '役割が明確（アーキテクチャ設計と実装リード）',
          '成果が定量的（開発速度2倍）',
          '学びが具体的で実践的',
          'プロジェクト期間が示されている'
        ],
        improvements: [
          'チームの規模や技術スタックの詳細があるとより良い',
          '直面した最大の課題とその克服方法を追加すると説得力が増す'
        ]
      }
    }
  ]);

  useEffect(() => {
    fetchInterview();
  }, [interviewId]);

  const fetchInterview = async () => {
    try {
      const data = await interviewService.getInterview(interviewId);
      setInterview(data);

      // 既存のフィードバックがあれば設定
      if (data) {
        setFeedback({
          technical_score: data.technical_score || 0,
          communication_score: data.communication_score || 0,
          cultural_fit_score: data.cultural_fit_score || 0,
          overall_score: data.overall_score || 0,
          notes: data.notes || '',
          feedback: data.feedback || '',
          result: data.result || 'pending',
        });
      }
    } catch (error) {
      console.error('Error fetching interview:', error);
      alert('面接情報の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
    router.push('/login');
  };

  const handleSave = async () => {
    if (!interview) return;

    // バリデーション
    if (feedback.result !== 'pending' && feedback.overall_score === 0) {
      alert('総合評価を入力してください');
      return;
    }

    setIsSaving(true);

    try {
      await interviewService.submitFeedback(interviewId, feedback);
      alert('評価を保存しました');
      router.push('/recruiter/interviews');
    } catch (error) {
      console.error('Error saving feedback:', error);
      alert('保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  const getResultLabel = (result: string) => {
    const labels: Record<string, string> = {
      pending: '未実施',
      passed: '合格',
      failed: '不合格',
      on_hold: '保留',
    };
    return labels[result] || result;
  };

  const getInterviewTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      phone: '電話',
      video: 'オンライン',
      onsite: '対面',
      technical: '技術面接',
      hr: '人事面接',
      final: '最終面接',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 blur-xl animate-pulse"></div>
        </div>
        <p className="mt-6 text-gray-700 font-medium">読み込み中...</p>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-bold text-gray-700 mb-4">面接が見つかりません</p>
          <Link href="/recruiter/interviews">
            <Button>面接一覧に戻る</Button>
          </Link>
        </div>
      </div>
    );
  }

  const averageAIScore = questionsAnswers.reduce((sum, qa) => sum + (qa.aiEvaluation?.score || 0), 0) / questionsAnswers.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/recruiter/dashboard" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                  <span className="text-white font-bold text-lg">HR</span>
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Agent System</span>
              </Link>
              <div className="hidden md:flex items-center space-x-1">
                <Link href="/recruiter/dashboard" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all">
                  ダッシュボード
                </Link>
                <Link href="/recruiter/jobs" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all">
                  求人管理
                </Link>
                <Link href="/recruiter/applications" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all">
                  応募管理
                </Link>
                <Link href="/recruiter/candidates" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all">
                  候補者検索
                </Link>
                <Link href="/recruiter/interviews" className="px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md">
                  面接管理
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleLogout} className="shadow-md hover:shadow-lg">
                ログアウト
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/recruiter/interviews">
              <Button variant="outline" size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                戻る
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">面接評価</h1>
          <p className="text-gray-600">候補者の回答を確認し、評価を入力してください</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Interview Info */}
            <Card>
              <CardBody className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    {interview.round_number}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {getInterviewTypeLabel(interview.interview_type)} - 第{interview.round_number}回
                    </h2>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{new Date(interview.scheduled_date).toLocaleString('ja-JP')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{interview.duration_minutes}分</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* AI Overall Evaluation */}
            <Card>
              <CardHeader title="AI総合評価" />
              <CardBody className="p-6">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-1">
                      {averageAIScore.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">/ 10.0</div>
                  </div>
                  <div className="flex-1">
                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">完成度</span>
                          <span className="font-medium">{(questionsAnswers.reduce((sum, qa) => sum + (qa.aiEvaluation?.completeness || 0), 0) / questionsAnswers.length).toFixed(1)}/10</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(questionsAnswers.reduce((sum, qa) => sum + (qa.aiEvaluation?.completeness || 0), 0) / questionsAnswers.length) * 10}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">具体性</span>
                          <span className="font-medium">{(questionsAnswers.reduce((sum, qa) => sum + (qa.aiEvaluation?.specificity || 0), 0) / questionsAnswers.length).toFixed(1)}/10</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: `${(questionsAnswers.reduce((sum, qa) => sum + (qa.aiEvaluation?.specificity || 0), 0) / questionsAnswers.length) * 10}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">関連性</span>
                          <span className="font-medium">{(questionsAnswers.reduce((sum, qa) => sum + (qa.aiEvaluation?.relevance || 0), 0) / questionsAnswers.length).toFixed(1)}/10</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${(questionsAnswers.reduce((sum, qa) => sum + (qa.aiEvaluation?.relevance || 0), 0) / questionsAnswers.length) * 10}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">コミュニケーション</span>
                          <span className="font-medium">{(questionsAnswers.reduce((sum, qa) => sum + (qa.aiEvaluation?.communication || 0), 0) / questionsAnswers.length).toFixed(1)}/10</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${(questionsAnswers.reduce((sum, qa) => sum + (qa.aiEvaluation?.communication || 0), 0) / questionsAnswers.length) * 10}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-blue-800">
                      この評価はAIエージェントによる自動分析結果です。最終的な判断は面接官の評価を優先してください。
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Questions and Answers */}
            {questionsAnswers.map((qa, index) => (
              <Card key={index}>
                <CardHeader
                  title={`質問 ${index + 1}`}
                />
                <CardBody className="p-6">
                  {/* Question */}
                  <div className="mb-6">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 mb-2">{qa.question}</p>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {qa.questionType}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            qa.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                            qa.difficulty === 'hard' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {qa.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Answer */}
                  <div className="mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-gray-900 whitespace-pre-wrap">{qa.answer}</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Evaluation */}
                  {qa.aiEvaluation && (
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <h4 className="font-semibold text-gray-900">AI評価</h4>
                        <span className="ml-auto text-lg font-bold text-purple-600">{qa.aiEvaluation.score}/10</span>
                      </div>

                      {/* Scores */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">完成度</span>
                            <span className="font-medium">{qa.aiEvaluation.completeness}/10</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${qa.aiEvaluation.completeness * 10}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">具体性</span>
                            <span className="font-medium">{qa.aiEvaluation.specificity}/10</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-green-600 h-1.5 rounded-full" style={{ width: `${qa.aiEvaluation.specificity * 10}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">関連性</span>
                            <span className="font-medium">{qa.aiEvaluation.relevance}/10</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${qa.aiEvaluation.relevance * 10}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">コミュニケーション</span>
                            <span className="font-medium">{qa.aiEvaluation.communication}/10</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-orange-600 h-1.5 rounded-full" style={{ width: `${qa.aiEvaluation.communication * 10}%` }}></div>
                          </div>
                        </div>
                      </div>

                      {/* Strengths */}
                      <div className="mb-3">
                        <h5 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          強み
                        </h5>
                        <ul className="space-y-1">
                          {qa.aiEvaluation.strengths.map((strength, i) => (
                            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-green-600 mt-0.5">•</span>
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Improvements */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          改善点
                        </h5>
                        <ul className="space-y-1">
                          {qa.aiEvaluation.improvements.map((improvement, i) => (
                            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-blue-600 mt-0.5">•</span>
                              <span>{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Sidebar - Evaluation Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader title="面接官評価" />
              <CardBody className="p-6">
                <div className="space-y-6">
                  {/* Scores */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      技術評価
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={feedback.technical_score}
                      onChange={(e) => setFeedback({ ...feedback, technical_score: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>0</span>
                      <span className="font-semibold text-blue-600">{feedback.technical_score}</span>
                      <span>10</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      コミュニケーション
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={feedback.communication_score}
                      onChange={(e) => setFeedback({ ...feedback, communication_score: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>0</span>
                      <span className="font-semibold text-blue-600">{feedback.communication_score}</span>
                      <span>10</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      カルチャーフィット
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={feedback.cultural_fit_score}
                      onChange={(e) => setFeedback({ ...feedback, cultural_fit_score: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>0</span>
                      <span className="font-semibold text-blue-600">{feedback.cultural_fit_score}</span>
                      <span>10</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      総合評価
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={feedback.overall_score}
                      onChange={(e) => setFeedback({ ...feedback, overall_score: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>0</span>
                      <span className="font-semibold text-blue-600 text-lg">{feedback.overall_score}</span>
                      <span>10</span>
                    </div>
                  </div>

                  {/* Result */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      判定
                    </label>
                    <select
                      value={feedback.result}
                      onChange={(e) => setFeedback({ ...feedback, result: e.target.value as "pending" | "passed" | "failed" | "on_hold" })}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition px-4 py-2"
                    >
                      <option value="pending">未決定</option>
                      <option value="passed">合格</option>
                      <option value="failed">不合格</option>
                      <option value="on_hold">保留</option>
                    </select>
                  </div>

                  {/* Feedback */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      フィードバック
                    </label>
                    <textarea
                      value={feedback.feedback}
                      onChange={(e) => setFeedback({ ...feedback, feedback: e.target.value })}
                      rows={4}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition px-4 py-3"
                      placeholder="候補者へのフィードバックを入力..."
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      メモ（内部用）
                    </label>
                    <textarea
                      value={feedback.notes}
                      onChange={(e) => setFeedback({ ...feedback, notes: e.target.value })}
                      rows={3}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition px-4 py-3"
                      placeholder="内部メモを入力..."
                    />
                  </div>

                  {/* Save Button */}
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    fullWidth
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        保存中...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        評価を保存
                      </>
                    )}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
