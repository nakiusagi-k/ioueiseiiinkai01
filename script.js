<!-- PDF出力ボタン -->
<button id="generatePdf">PDF出力</button>

<!-- ライブラリ読み込み -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const inspectionItemsContainer = document.getElementById('inspectionItems');
  const generatePdfButton = document.getElementById('generatePdf');

  const inspectionItemsData = [
    "安全通路の確保", "整理整頓の状況", "照明の適切さ", "非常口の表示と確保", "消火器の設置と点検",
    "機械設備の安全カバー", "電気設備の点検", "高所作業の安全対策", "危険物保管の適切さ", "保護具の着用状況",
    "標識・表示の明瞭さ", "作業手順の遵守", "緊急時の連絡体制", "床面の滑り・障害物", "換気設備の点検",
    "有害物質の管理", "ヒヤリハットの共有", "作業員の健康状態", "清掃状況", "安全衛生教育の実施"
  ];

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
        <input type="file" accept="image/*" class="photo-upload" id="photo-${itemId}" multiple>
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

  generatePdfButton.addEventListener('click', () => {
    const element = document.getElementById('pdf-content');

    // 点検者
    const selectedInspectors = Array.from(document.querySelectorAll('input[name="inspector"]:checked'))
                                     .map(cb => cb.value);
    const inspectorNames = selectedInspectors.length > 0 ? selectedInspectors.join(', ') : '未選択';
    const today = new Date();
    const dateString = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;

    const header = document.createElement('div');
    header.innerHTML = `
      <h2>点検実施者: ${inspectorNames}</h2>
      <h3>点検日: ${dateString}</h3>
      <hr>
    `;
    element.insertBefore(header, element.firstChild);

    html2pdf().set({
      margin:       10,
      filename:     '医王ヶ丘安全点検結果.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  {
        scale: 2,
        useCORS: true,
        scrollY: 0,
        allowTaint: true
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      }
    }).from(element).save().then(() => {
      header.remove();
    });
  });
});
</script>
