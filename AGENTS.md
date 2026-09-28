작업을 시작하기 전에 프로젝트 루트의 다음 문서를 반드시 확인한다.

작업지시.md

PickPlay의 제품 및 개발 사양 기준 문서다.

개발체크리스트.md

실제 개발 순서와 완료 조건의 기준 문서다.

사용자가 특정 작업번호를 지시하면 해당 범위만 작업한다.

체크리스트에 존재하지 않는 작업번호나 완료조건을 임의로 만들지 않는다.

문서 간 내용이 충돌하거나 사용자가 지정한 작업번호가 존재하지 않을 경우 임의로 추정하여 개발하지 말고 해당 사실을 보고한다.

이미 완료된 체크리스트 항목은 문제 수정 요청이 없는 한 다시 구현하지 않는다.

## File encoding

모든 소스와 Markdown 파일은 UTF-8로 저장한다.

Windows PowerShell에서 파일 전체를 생성하거나 수정할 때
인코딩이 달라질 수 있는 redirection 방식은 사용하지 않는다.

한국어 문자열을 포함한 파일을 생성한 후에는
실제 브라우저에서 한국어 표시를 확인한다.

� 문자가 발견되거나 한글이 mojibake 형태로 보이면
해당 작업을 완료 처리하지 않는다.

\# PickPlay Codex Project Instructions



\## Project



PickPlay is a lightweight browser-based game platform with two product tracks.



PLAY



Free random pickers, mini games, classroom games and party games.



BUSINESS



A self-service marketing event platform for merchants using missions, games, prizes, coupons and QR codes.



\---



\## Mandatory reading



Before making architectural changes read:



PICKPLAY\_개발사양서.md



PICKPLAY\_개발체크리스트.md



Do not rebuild already completed checklist items unless fixing a confirmed problem.



\---



\## Primary priorities



Priority 1



Simple UX.



A new user must understand each game within 5 seconds.



Priority 2



Performance.



Public game pages must remain extremely lightweight.



Priority 3



Mobile usability.



Priority 4



Business conversion.



After playing an eligible game users should be able to create a merchant event based on that game.



Priority 5



Security.



Prize results and coupon state must be decided and stored server-side.



\---



\## Game UI rule



Every game must contain:



Title



One sentence description



Player count



Approximate duration



Maximum three basic rule steps



Game



Result



Replay



Related games



Business CTA when applicable



Do not place long instructions before the game.



\---



\## Copy rule



Use simple Korean.



Prefer:



이름을 넣고 룰렛을 돌려보세요.



Avoid:



랜덤 알고리즘을 실행하여 참가자를 선정합니다.



\---



\## Performance



Do not add video.



Do not add animated GIF.



Prefer:



CSS



Canvas



SVG



small optimized AVIF/WebP



Do not add a heavy UI framework without explicit approval.



Do not load code for games that are not on the current route.



Do not load Business dashboard code on free game pages.



Do not add a webfont during MVP.



Use route-level code splitting.



Lazy load non-critical resources.



\---



\## Architecture



Preferred public frontend:



Astro + TypeScript



Interactive game components:



Vanilla TypeScript first.



Use React islands only when state complexity justifies them.



Backend:



Cloudflare Workers



Database:



Cloudflare D1



Files:



Cloudflare R2



\---



\## Business security



Never determine a real prize solely in browser JavaScript.



Required sequence:



client requests play



server validates ticket



server selects/reserves prize



server writes result



server returns result



renderer displays animation



Never expose the full private prize inventory to the client.



Coupon redemption must be validated server-side.



Gifticon assets must not use permanent public URLs.



\---



\## Game renderer



Separate game presentation from game result logic.



Examples:



WheelRenderer



ScratchRenderer



PaperRenderer



CapsuleRenderer



Game renderers receive a result.



They do not decide valuable prize outcomes.



\---



\## Open source



Before adding a third-party package check:



license



commercial usage



bundle size



maintenance status



dependencies



security



Wrap reusable game libraries behind an adapter when practical.



Do not couple the application directly to one external game library.



\---



\## Task execution



Work only on the checklist items specified by the user.



Before editing:



1\. Inspect the relevant existing files.

2\. Confirm whether an existing component can be reused.

3\. Avoid duplicate components.



After editing:



1\. Run typecheck.

2\. Run relevant tests.

3\. Run build when practical.

4\. Report changed files.

5\. Report tests.

6\. Report remaining issues.

7\. Update the checklist only for actually completed items.



Do not mark an item complete just because code was generated.



\---



\## Refactoring



Do not perform unrelated refactors during a feature task.



If a refactor is needed, explain why and keep its scope minimal.



\---



\## Dependencies



Prefer zero-dependency or small-dependency solutions.



Before installing a package ask:



Can this reasonably be implemented with native browser APIs?



Examples:



Canvas



Web Crypto



Web Share



LocalStorage



CSS animations



Use native APIs when they produce simpler and smaller code.



\---



\## Images



Game icons should preferably be SVG.



Raster thumbnails should be optimized.



Always provide width and height.



Lazy load below-the-fold images.



Do not use a large original upload directly in the UI.



\---



\## Accessibility



Buttons require accessible labels.



Keyboard users should be able to access ordinary controls.



Do not communicate status with color alone.



Respect prefers-reduced-motion.



\---



\## Definition of done



A task is not complete until:



implementation works



mobile UI works



no obvious console errors



typecheck passes



relevant tests pass



no unnecessary heavy asset was added



the checklist acceptance criteria are satisfied



\---



\## Usage-efficiency rule for Codex



Do not repeatedly read the entire repository.



Start with the specification, checklist item and directly relevant files.



Search before opening large numbers of files.



Avoid rewriting complete files when a small patch is enough.



Do not generate lengthy explanations unless requested.



Prefer concise implementation reports.

