/**
 * terms.tsx
 * 
 * 利用規約ページ
 * サービスの利用に関する規約を表示
 */

import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { LayoutWithFooter } from '@/components/layouts/Layout'

const TermsPage: React.FC = () => {
  // 最終更新日
  const lastUpdated = '2025年1月1日'
  
  return (
    <LayoutWithFooter>
      <Head>
        <title>利用規約 - 3D文化財共有サイト</title>
        <meta name="description" content="3D文化財共有サイトの利用規約です。サービスをご利用いただく前に必ずお読みください。" />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* ページヘッダー */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            利用規約
          </h1>
          <p className="text-gray-500 text-sm">
            最終更新日: {lastUpdated}
          </p>
        </div>

        {/* 本文 */}
        <div className="prose prose-gray max-w-none">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-8">
            
            {/* 前文 */}
            <section>
              <p className="text-gray-600 leading-relaxed">
                この利用規約（以下「本規約」といいます）は、3D文化財共有サイト（以下「本サービス」といいます）の利用条件を定めるものです。
                ユーザーの皆様には、本規約に同意いただいた上で、本サービスをご利用いただきます。
              </p>
            </section>

            {/* 第1条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                第1条（適用）
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>本規約は、ユーザーと運営者との間の本サービスの利用に関わる一切の関係に適用されます。</li>
                <li>運営者は本サービスに関し、本規約のほか、ご利用にあたってのルール等、各種の定め（以下「個別規定」といいます）をすることがあります。これら個別規定はその名称のいかんに関わらず、本規約の一部を構成するものとします。</li>
                <li>本規約の規定が前条の個別規定の規定と矛盾する場合には、個別規定において特段の定めなき限り、個別規定の規定が優先されるものとします。</li>
              </ol>
            </section>

            {/* 第2条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                第2条（利用登録）
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>本サービスにおいては、登録希望者が本規約に同意の上、運営者の定める方法によって利用登録を申請し、運営者がこれを承認することによって、利用登録が完了するものとします。</li>
                <li>運営者は、利用登録の申請者に以下の事由があると判断した場合、利用登録の申請を承認しないことがあり、その理由については一切の開示義務を負わないものとします。
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>利用登録の申請に際して虚偽の事項を届け出た場合</li>
                    <li>本規約に違反したことがある者からの申請である場合</li>
                    <li>その他、運営者が利用登録を相当でないと判断した場合</li>
                  </ul>
                </li>
              </ol>
            </section>

            {/* 第3条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                第3条（ユーザーIDおよびパスワードの管理）
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>ユーザーは、自己の責任において、本サービスのユーザーIDおよびパスワードを適切に管理するものとします。</li>
                <li>ユーザーは、いかなる場合にも、ユーザーIDおよびパスワードを第三者に譲渡または貸与し、もしくは第三者と共用することはできません。</li>
                <li>運営者は、ユーザーIDとパスワードの組み合わせが登録情報と一致してログインされた場合には、そのユーザーIDを登録しているユーザー自身による利用とみなします。</li>
                <li>ユーザーIDおよびパスワードが第三者によって使用されたことによって生じた損害は、運営者に故意又は重大な過失がある場合を除き、運営者は一切の責任を負わないものとします。</li>
              </ol>
            </section>

            {/* 第4条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                第4条（禁止事項）
              </h2>
              <p className="text-gray-600 mb-3">ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>法令または公序良俗に違反する行為</li>
                <li>犯罪行為に関連する行為</li>
                <li>運営者、本サービスの他のユーザー、または第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
                <li>本サービスの運営を妨害するおそれのある行為</li>
                <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
                <li>不正アクセスをし、またはこれを試みる行為</li>
                <li>他のユーザーに成りすます行為</li>
                <li>運営者のサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為</li>
                <li>運営者、本サービスの他のユーザーまたは第三者の知的財産権、肖像権、プライバシー、名誉その他の権利または利益を侵害する行為</li>
                <li>虚偽の情報を登録する行為</li>
                <li>本サービスの趣旨に反するコンテンツを登録する行為</li>
                <li>わいせつ、暴力的、差別的な表現を含むコンテンツを登録する行為</li>
                <li>その他、運営者が不適切と判断する行為</li>
              </ol>
            </section>

            {/* 第5条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                第5条（本サービスの提供の停止等）
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>運営者は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
                    <li>地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合</li>
                    <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                    <li>その他、運営者が本サービスの提供が困難と判断した場合</li>
                  </ul>
                </li>
                <li>運営者は、本サービスの提供の停止または中断により、ユーザーまたは第三者が被ったいかなる不利益または損害についても、一切の責任を負わないものとします。</li>
              </ol>
            </section>

            {/* 第6条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                第6条（著作権・知的財産権）
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>ユーザーは、自ら著作権等の必要な知的財産権を有するか、または必要な権利者の許諾を得た文章、画像、動画、3Dモデル等の情報に関してのみ、本サービスを利用し、投稿することができるものとします。</li>
                <li>ユーザーが本サービスを利用して投稿した文章、画像、動画、3Dモデル等の著作権については、当該ユーザーその他既存の権利者に留保されるものとします。ただし、運営者は、本サービスの提供、維持、改善、またはプロモーション等に必要な範囲において、当該コンテンツを無償で利用できるものとします。</li>
                <li>ユーザーは、運営者および運営者から権利を承継しまたは許諾された者に対して著作者人格権を行使しないことに同意するものとします。</li>
              </ol>
            </section>

            {/* 第7条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                第7条（利用制限および登録抹消）
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>運営者は、ユーザーが以下のいずれかに該当する場合には、事前の通知なく、投稿データを削除し、ユーザーに対して本サービスの全部もしくは一部の利用を制限しまたはユーザーとしての登録を抹消することができるものとします。
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>本規約のいずれかの条項に違反した場合</li>
                    <li>登録事項に虚偽の事実があることが判明した場合</li>
                    <li>運営者からの連絡に対し、一定期間返答がない場合</li>
                    <li>本サービスについて、最終の利用から一定期間利用がない場合</li>
                    <li>その他、運営者が本サービスの利用を適当でないと判断した場合</li>
                  </ul>
                </li>
                <li>運営者は、本条に基づき運営者が行った行為によりユーザーに生じた損害について、一切の責任を負いません。</li>
              </ol>
            </section>

            {/* 第8条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                第8条（退会）
              </h2>
              <p className="text-gray-600">
                ユーザーは、運営者の定める退会手続により、本サービスから退会できるものとします。
              </p>
            </section>

            {/* 第9条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                第9条（保証の否認および免責事項）
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>運営者は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。</li>
                <li>運営者は、本サービスに起因してユーザーに生じたあらゆる損害について、運営者の故意又は重過失による場合を除き、一切の責任を負いません。</li>
                <li>運営者は、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。</li>
              </ol>
            </section>

            {/* 第10条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                第10条（サービス内容の変更等）
              </h2>
              <p className="text-gray-600">
                運営者は、ユーザーへの事前の告知をもって、本サービスの内容を変更、追加または廃止することがあり、ユーザーはこれを承諾するものとします。
              </p>
            </section>

            {/* 第11条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                第11条（利用規約の変更）
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>運営者は以下の場合には、ユーザーの個別の同意を要せず、本規約を変更することができるものとします。
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>本規約の変更がユーザーの一般の利益に適合するとき</li>
                    <li>本規約の変更が本サービス利用契約の目的に反せず、かつ、変更の必要性、変更後の内容の相当性その他の変更に係る事情に照らして合理的なものであるとき</li>
                  </ul>
                </li>
                <li>運営者はユーザーに対し、前項による本規約の変更にあたり、事前に、本規約を変更する旨及び変更後の本規約の内容並びにその効力発生時期を通知します。</li>
              </ol>
            </section>

            {/* 第12条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                第12条（個人情報の取扱い）
              </h2>
              <p className="text-gray-600">
                運営者は、本サービスの利用によって取得する個人情報については、運営者「プライバシーポリシー」に従い適切に取り扱うものとします。
                詳細については<Link href="/privacy" className="text-blue-600 hover:underline">プライバシーポリシー</Link>をご参照ください。
              </p>
            </section>

            {/* 第13条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                第13条（通知または連絡）
              </h2>
              <p className="text-gray-600">
                ユーザーと運営者との間の通知または連絡は、運営者の定める方法によって行うものとします。運営者は、ユーザーから、運営者が別途定める方式に従った変更届け出がない限り、現在登録されている連絡先が有効なものとみなして当該連絡先へ通知または連絡を行い、これらは、発信時にユーザーへ到達したものとみなします。
              </p>
            </section>

            {/* 第14条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                第14条（権利義務の譲渡の禁止）
              </h2>
              <p className="text-gray-600">
                ユーザーは、運営者の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、または担保に供することはできません。
              </p>
            </section>

            {/* 第15条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                第15条（準拠法・裁判管轄）
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>本規約の解釈にあたっては、日本法を準拠法とします。</li>
                <li>本サービスに関して紛争が生じた場合には、運営者の本店所在地を管轄する裁判所を専属的合意管轄とします。</li>
              </ol>
            </section>

            {/* 附則 */}
            <section className="pt-6 border-t border-gray-200">
              <p className="text-gray-500 text-sm">
                本規約は{lastUpdated}から適用されます。
              </p>
            </section>
          </div>
        </div>

        {/* フッターリンク */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 hover:underline">
            ← ホームに戻る
          </Link>
        </div>
      </div>
    </LayoutWithFooter>
  )
}

export default TermsPage
