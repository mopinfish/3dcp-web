/**
 * privacy.tsx
 *
 * プライバシーポリシーページ
 * 個人情報の取扱いについて説明
 */

import { LayoutWithFooter } from '@/components/layouts/Layout'

export default function PrivacyPage() {
  return (
    <LayoutWithFooter>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ヘッダー */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              プライバシーポリシー
            </h1>
            <p className="text-gray-600">
              3DCP - 3D Cultural
              Properties（以下「本サービス」）は、ユーザーの個人情報保護を重要視し、
              個人情報の保護に関する法律（個人情報保護法）を遵守して、適切な取扱いを行います。
            </p>
            <p className="text-sm text-gray-500 mt-4">
              最終更新日: 2025年1月1日
            </p>
          </div>

          {/* 本文 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="prose prose-gray max-w-none">
              {/* 第1条 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  第1条（個人情報の定義）
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  本プライバシーポリシーにおいて「個人情報」とは、個人情報保護法第2条第1項に定義される個人情報、
                  すなわち生存する個人に関する情報であって、当該情報に含まれる氏名、メールアドレス、
                  その他の記述等により特定の個人を識別することができるもの（他の情報と容易に照合することができ、
                  それにより特定の個人を識別することができることとなるものを含む）を指します。
                </p>
              </section>

              {/* 第2条 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  第2条（個人情報の収集方法）
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  本サービスは、以下の方法により個人情報を収集することがあります。
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                  <li>
                    ユーザーがアカウント登録をする際に入力するメールアドレス、ユーザー名、パスワード
                  </li>
                  <li>
                    ユーザーがプロフィールを編集する際に入力する情報（表示名、自己紹介など）
                  </li>
                  <li>
                    ユーザーが文化財やコンテンツを登録する際に入力する情報
                  </li>
                  <li>
                    お問い合わせフォームなどを通じてユーザーから提供される情報
                  </li>
                  <li>
                    本サービスの利用に伴い自動的に収集される情報（IPアドレス、ブラウザ情報、アクセスログなど）
                  </li>
                  <li>Cookieおよび類似技術により収集される情報</li>
                </ol>
              </section>

              {/* 第3条 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  第3条（個人情報の利用目的）
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  本サービスは、収集した個人情報を以下の目的で利用します。
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                  <li>本サービスの提供・運営・維持</li>
                  <li>ユーザーからのお問い合わせへの対応</li>
                  <li>本サービスに関するお知らせやメンテナンス情報の通知</li>
                  <li>利用規約に違反する行為への対応</li>
                  <li>本サービスの改善および新機能の開発</li>
                  <li>利用状況の分析および統計データの作成</li>
                  <li>不正アクセスや不正利用の防止</li>
                  <li>ユーザー認証およびアカウント管理</li>
                  <li>上記に付随する業務</li>
                </ol>
              </section>

              {/* 第4条 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  第4条（利用目的の変更）
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  本サービスは、利用目的が変更前と関連性を有すると合理的に認められる場合に限り、
                  個人情報の利用目的を変更することがあります。
                  利用目的を変更した場合は、変更後の目的について本サービス上に公表するものとします。
                </p>
              </section>

              {/* 第5条 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  第5条（第三者への提供）
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  本サービスは、以下の場合を除き、ユーザーの同意なく第三者に個人情報を提供することはありません。
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                  <li>法令に基づく場合</li>
                  <li>
                    人の生命、身体または財産の保護のために必要がある場合であって、
                    本人の同意を得ることが困難であるとき
                  </li>
                  <li>
                    公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、
                    本人の同意を得ることが困難であるとき
                  </li>
                  <li>
                    国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して
                    協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき
                  </li>
                </ol>
              </section>

              {/* 第6条 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  第6条（個人情報の開示）
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  本サービスは、本人から個人情報の開示を求められたときは、本人に対し遅滞なくこれを開示します。
                  ただし、開示することにより以下のいずれかに該当する場合は、その全部または一部を開示しないことがあり、
                  開示しない決定をした場合は、その旨を遅滞なく通知します。
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                  <li>
                    本人または第三者の生命、身体、財産その他の権利利益を害するおそれがある場合
                  </li>
                  <li>
                    本サービスの業務の適正な実施に著しい支障を及ぼすおそれがある場合
                  </li>
                  <li>法令に違反することとなる場合</li>
                </ol>
              </section>

              {/* 第7条 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  第7条（個人情報の訂正・削除）
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  ユーザーは、本サービスの保有する自己の個人情報が誤った情報である場合には、
                  本サービスが定める手続きにより、個人情報の訂正または削除を請求することができます。
                  本サービスは、ユーザーから請求を受けた場合、遅滞なく必要な調査を行い、
                  その結果に基づき個人情報の訂正または削除を行い、その旨をユーザーに通知します。
                </p>
              </section>

              {/* 第8条 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  第8条（個人情報の利用停止等）
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  本サービスは、本人から個人情報が利用目的の範囲を超えて取り扱われているという理由、
                  または不正の手段により取得されたものであるという理由により、
                  その利用の停止または消去（以下「利用停止等」）を求められた場合には、
                  遅滞なく必要な調査を行い、その結果に基づき個人情報の利用停止等を行い、
                  その旨を本人に通知します。ただし、個人情報の利用停止等に多額の費用を要する場合その他
                  利用停止等を行うことが困難な場合であって、本人の権利利益を保護するために必要なこれに代わるべき
                  措置をとれる場合は、この代替策を講じるものとします。
                </p>
              </section>

              {/* 第9条 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  第9条（Cookieの使用について）
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  本サービスは、ユーザー体験の向上、サービスの改善、利用状況の分析などを目的として、
                  Cookieおよび類似の技術を使用しています。
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Cookieとは、Webサイトがユーザーのブラウザに送信する小さなテキストファイルです。
                  これにより、ユーザーのブラウザを識別し、次回訪問時にログイン状態を維持するなどの機能を提供できます。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  ユーザーは、ブラウザの設定によりCookieの受け入れを拒否することができますが、
                  その場合、本サービスの一部の機能が利用できなくなることがあります。
                </p>
              </section>

              {/* 第10条 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  第10条（アクセス解析ツールについて）
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  本サービスは、サービスの利用状況を把握するためにGoogle
                  Analyticsなどのアクセス解析ツールを使用することがあります。
                  これらのツールはCookieを使用してデータを収集しますが、
                  このデータは匿名で収集されており、個人を特定するものではありません。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Google Analyticsの利用規約については、
                  <a
                    href="https://marketingplatform.google.com/about/analytics/terms/jp/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Google アナリティクス利用規約
                  </a>
                  をご確認ください。また、Google社のプライバシーポリシーについては、
                  <a
                    href="https://policies.google.com/privacy?hl=ja"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Google プライバシーポリシー
                  </a>
                  をご確認ください。
                </p>
              </section>

              {/* 第11条 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  第11条（セキュリティ対策）
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  本サービスは、個人情報の漏洩、滅失または毀損を防止するため、
                  以下のセキュリティ対策を実施しています。
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>SSL/TLS暗号化通信の使用</li>
                  <li>パスワードのハッシュ化保存</li>
                  <li>定期的なセキュリティ監査の実施</li>
                  <li>アクセス権限の適切な管理</li>
                  <li>サーバーの物理的・論理的なセキュリティ確保</li>
                </ul>
              </section>

              {/* 第12条 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  第12条（未成年者の個人情報）
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  本サービスは、18歳未満の方からの個人情報の収集を意図していません。
                  18歳未満の方が本サービスを利用する場合は、保護者の同意を得た上でご利用ください。
                  18歳未満の方の個人情報を収集したことが判明した場合は、
                  速やかに当該情報を削除するなど適切な対応を行います。
                </p>
              </section>

              {/* 第13条 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  第13条（個人情報の保管期間）
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  本サービスは、利用目的を達成するために必要な期間、個人情報を保管します。
                  ユーザーがアカウントを削除した場合、または本サービスがサービスを終了した場合は、
                  法令に基づき保管が必要な場合を除き、合理的な期間内に個人情報を削除します。
                </p>
              </section>

              {/* 第14条 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  第14条（プライバシーポリシーの変更）
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  本プライバシーポリシーの内容は、法令その他本プライバシーポリシーに別段の定めのある事項を除いて、
                  ユーザーに通知することなく変更することができるものとします。
                  変更後のプライバシーポリシーは、本サービス上に掲示した時点から効力を生じるものとします。
                </p>
              </section>

              {/* 第15条 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  第15条（お問い合わせ窓口）
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  本プライバシーポリシーに関するお問い合わせは、以下の窓口までご連絡ください。
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">
                    <span className="font-medium">サービス名:</span> 3DCP - 3D
                    Cultural Properties
                  </p>
                  <p className="text-gray-700 mt-2">
                    <span className="font-medium">メールアドレス:</span>{' '}
                    <a
                      href="mailto:mopinfish@gmail.com"
                      className="text-blue-600 hover:underline"
                    >
                      mopinfish@gmail.com
                    </a>
                  </p>
                </div>
              </section>
            </div>
          </div>

          {/* フッターナビゲーション */}
          <div className="mt-8 text-center">
            <a
              href="/terms"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              利用規約を見る →
            </a>
          </div>
        </div>
      </div>
    </LayoutWithFooter>
  )
}
