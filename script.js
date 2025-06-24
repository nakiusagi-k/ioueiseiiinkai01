document.addEventListener('DOMContentLoaded', () => {
    const inspectionItemsContainer = document.getElementById('inspectionItems');
    const generatePdfButton = document.getElementById('generatePdf');

    // 点検項目データ (20項目)
    const inspectionItemsData = [
        "安全通路の確保",
        "整理整頓の状況",
        "照明の適切さ",
        "非常口の表示と確保",
        "消火器の設置と点検",
        "機械設備の安全カバー",
        "電気設備の点検",
        "高所作業の安全対策",
        "危険物保管の適切さ",
        "保護具の着用状況",
        "標識・表示の明瞭さ",
        "作業手順の遵守",
        "緊急時の連絡体制",
        "床面の滑り・障害物",
        "換気設備の点検",
        "有害物質の管理",
        "ヒヤリハットの共有",
        "作業員の健康状態",
        "清掃状況",
        "安全衛生教育の実施"
    ];

    // 手書き機能の削除に伴い、drawingCanvasesは不要になります

    // 点検項目を動的に生成
    inspectionItemsData.forEach((itemText, index) => {
        const itemId = `item${index + 1}`;
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('inspection-item');
        itemDiv.innerHTML = `
            <h3>${index + 1}. ${itemText}</h3>
            <div class="score-selection">
                <label><input type="radio" name="${itemId}-score" value="3" required> 3点</label>
                <label><input type="radio" name="${itemId}-score" value="2"> 2点</label>
                <label><input type="radio" name="${itemId}-score" value="1"> 1点</label>
            </div>
            <div class="photo-section">
                <h4>写真:</h4>
                <input type="file" accept="image/*" class="photo-upload" id="photo-${itemId}" data-item-id="${itemId}" multiple>
                <div class="photo-preview" id="preview-${itemId}"></div>
            </div>
        `;
        inspectionItemsContainer.appendChild(itemDiv);

        // 手書き機能関連のコードを削除します
        // const canvas = document.getElementById(`canvas-${itemId}`);
        // ... (手書き関連のイベントリスナーやクリアボタンの処理を全て削除) ...

        // 写真アップロード機能
        const photoUploadInput = document.getElementById(`photo-${itemId}`);
        const photoPreviewDiv = document.getElementById(`preview-${itemId}`);
        photoUploadInput.addEventListener('change', (event) => {
            Array.from(event.target.files).forEach(file => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const imgWrapper = document.createElement('div');
                        imgWrapper.classList.add('photo-wrapper');
                        const img = document.createElement('img');
                        img.src = e.target.result;

                        const deleteBtn = document.createElement('button');
                        deleteBtn.classList.add('delete-photo');
                        deleteBtn.textContent = '削除';
                        deleteBtn.addEventListener('click', () => {
                            imgWrapper.remove();
                        });
                        imgWrapper.appendChild(img);
                        imgWrapper.appendChild(deleteBtn);
                        photoPreviewDiv.appendChild(imgWrapper);
                    };
                    reader.readAsDataURL(file);
                }
            });
        });
    });

    // PDF生成機能
    generatePdfButton.addEventListener('click', async () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // 埋め込んだ日本語フォントを追加 (前回の手順で変換・配置したファイルが必要です)
        doc.addFont('NotoSansJP-Regular-normal.js', 'NotoSansJP-Regular', 'normal');
        doc.setFont('NotoSansJP-Regular', 'normal');

        let yPos = 10;
        doc.setFontSize(16);
        doc.text("職場安全点検結果", 10, yPos);
        yPos += 15;

        // 参加者情報を取得してPDFに追加
        const selectedInspector = document.querySelector('input[name="inspector"]:checked');
        const inspectorName = selectedInspector ? selectedInspector.value : '未選択';
        doc.setFontSize(12);
        doc.text(`点検実施者: ${inspectorName}`, 10, yPos);
        yPos += 10;

        // 点検日を追加
        const today = new Date();
        const dateString = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
        doc.text(`点検日: ${dateString}`, 10, yPos);
        yPos += 15; // 次のセクションとの間隔を空ける

        doc.setFontSize(12); // 項目テキストのフォントサイズに戻す

        for (let i = 0; i < inspectionItemsData.length; i++) {
            const itemId = `item${i + 1}`;
            const itemText = inspectionItemsData[i];
            const selectedScore = document.querySelector(`input[name="${itemId}-score"]:checked`);
            const score = selectedScore ? selectedScore.value : '未選択';

            doc.text(`${i + 1}. ${itemText} (点数: ${score})`, 10, yPos);
            yPos += 7;

            // 手書きメモの取得部分は削除

            // 写真の取得
            const photoPreviewDiv = document.getElementById(`preview-${itemId}`);
            const photos = photoPreviewDiv.querySelectorAll('img');
            if (photos.length > 0) {
                doc.text("写真:", 15, yPos);
                yPos += 5;
                for (const img of photos) {
                    const imgData = img.src;
                    const imgWidth = 50; // PDF内の画像の幅
                    const imgHeight = (img.naturalHeight / img.naturalWidth) * imgWidth;
                    // 新しいページに収まらない場合はページ追加
                    if (yPos + imgHeight + 5 > doc.internal.pageSize.height - 20) {
                        doc.addPage();
                        yPos = 10;
                        doc.setFont('NotoSansJP-Regular', 'normal'); // 新しいページでもフォント設定を維持
                    }
                    doc.addImage(imgData, 'JPEG', 15, yPos, imgWidth, imgHeight);
                    yPos += imgHeight + 5;
                }
            }

            yPos += 10; // 次の項目との間隔
            if (yPos > doc.internal.pageSize.height - 30) { // ページが溢れそうなら新しいページ
                doc.addPage();
                yPos = 10;
                doc.setFont('NotoSansJP-Regular', 'normal'); // 新しいページでもフォント設定を維持
            }
        }

        // PDFの保存
        doc.save('安全点検結果.pdf');
    });
});
