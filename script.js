document.addEventListener('DOMContentLoaded', () => {
    const inspectionItemsContainer = document.getElementById('inspectionItems');
    const generatePdfButton = document.getElementById('generatePdf');

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

    // 各点検項目を動的に生成する処理 (変更なし)
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

        // ----------------------------------------------------
        // 日本語フォントの設定をより確実にするための修正
        // ----------------------------------------------------
        doc.addFont('NotoSansJP-Regular-normal.js', 'NotoSansJP-Regular', 'normal');
        doc.setFont('NotoSansJP-Regular', 'normal'); // 初期フォント設定

        let yPos = 10;
        doc.setFontSize(16);
        doc.text("医王ヶ丘職場安全点検結果", 10, yPos);
        yPos += 15;

        // 点検実施者情報を取得
        const selectedInspectors = Array.from(document.querySelectorAll('input[name="inspector"]:checked'))
                                       .map(checkbox => checkbox.value);
        const inspectorNames = selectedInspectors.length > 0 ? selectedInspectors.join(', ') : '未選択';
        doc.setFontSize(12);
        doc.text(`点検実施者: ${inspectorNames}`, 10, yPos);
        yPos += 10;

        // 点検日情報を追加
        const today = new Date();
        const dateString = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
        doc.text(`点検日: ${dateString}`, 10, yPos);
        yPos += 15;

        doc.setFontSize(12); // 項目テキストのフォントサイズに戻す

        let totalScore = 0; // 合計点数用変数

        // 各点検項目の情報をPDFに追加
        for (let i = 0; i < inspectionItemsData.length; i++) {
            const itemId = `item${i + 1}`;
            const itemText = inspectionItemsData[i];
            const selectedScoreRadio = document.querySelector(`input[name="${itemId}-score"]:checked`);
            const score = selectedScoreRadio ? parseInt(selectedScoreRadio.value, 10) : 0; // 点数を数値として取得、未選択は0点
            totalScore += score; // 合計点数に加算

            // 新しいページに移る可能性があるため、ここでフォント設定を再確認
            if (yPos > doc.internal.pageSize.height - 40) { // 次の項目が収まらないと判断
                doc.addPage();
                yPos = 10;
                doc.setFont('NotoSansJP-Regular', 'normal'); // 新しいページでもフォント設定を再適用
                doc.setFontSize(12); // フォントサイズもリセット
            }

            doc.text(`${i + 1}. ${itemText} (点数: ${score}点)`, 10, yPos);
            yPos += 7;

            // 写真の取得と追加
            const photoPreviewDiv = document.getElementById(`preview-${itemId}`);
            const photos = photoPreviewDiv.querySelectorAll('img');
            if (photos.length > 0) {
                doc.text("写真:", 15, yPos);
                yPos += 5;
                for (const img of photos) {
                    const imgData = img.src;
                    const imgWidth = 50;
                    const imgHeight = (img.naturalHeight / img.naturalWidth) * imgWidth;

                    if (yPos + imgHeight + 5 > doc.internal.pageSize.height - 20) { // 画像が収まらないと判断
                        doc.addPage();
                        yPos = 10;
                        doc.setFont('NotoSansJP-Regular', 'normal'); // 新しいページでもフォント設定を再適用
                        doc.setFontSize(12); // フォントサイズもリセット
                    }
                    doc.addImage(imgData, 'JPEG', 15, yPos, imgWidth, imgHeight);
                    yPos += imgHeight + 5;
                }
            }

            yPos += 10; // 次の項目との間隔
        }

        // 合計点数をPDFの最後に追加
        if (yPos > doc.internal.pageSize.height - 30) { // 合計点数が収まらないと判断
            doc.addPage();
            yPos = 10;
            doc.setFont('NotoSansJP-Regular', 'normal'); // 新しいページでもフォント設定を再適用
            doc.setFontSize(12); // フォントサイズもリセット
        }
        doc.setFontSize(14); // 合計点数を少し大きく表示
        doc.text(`合計点数: ${totalScore}点`, 10, yPos);

        // PDFの保存
        doc.save('医王ヶ丘安全点検結果.pdf');
    });
});
