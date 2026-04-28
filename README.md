# Local LoRA Workstation Planner

싱글 노드 기준 Local LoRA 구축 사양을 계산하는 정적 웹페이지입니다.

## 기본 기준

- 모델: Llama 3 8B
- 학습 방식: LoRA / QLoRA
- 캐시: Local Redis
- 검색: q-q intent embedding RAG
- 가격: 예상가 기준 고정값
- 가격 출처: 화면에 표시하지 않음
- 메모리: 128GB 풀뱅크 구성 시 클럭 하락 가능성을 안내

## 로컬 확인

브라우저에서 `index.html`을 직접 열면 됩니다.

## Vercel 배포

정적 사이트라 별도 빌드가 필요 없습니다.

```bash
vercel
```

또는 Git 저장소를 Vercel에 연결하면 루트의 `index.html`이 배포됩니다.
