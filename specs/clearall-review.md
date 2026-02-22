# clearAll Review — Codex Phase 3
Status: **LGTM** (minor notes)

## Findings

### [Low] Loading state missing during deletion
While `clearAll` is executing, the button has no disabled/loading state.  
On slow connections, user could click multiple times.  
**Fix:** Add `const [clearing, setClearing] = useState(false)` and disable button during mutation.

### [Low] No toast/feedback after success
After clearing, the board silently empties. A brief success message would improve UX.  
**Fix:** Add a simple toast or temporary "Cleared." message.

## Criteria Check
- Correctness: ✅ `clearAll` fetches all tasks and deletes with `Promise.all`
- Empty list edge case: ✅ Button only shown when `tasks.length > 0`
- Convex pattern: ✅ Follows same pattern as `remove` mutation
- UI styling: ✅ Matches existing red/danger style (`border-red-800`, `Trash2`, `py-1.5`)
- Confirm dialog: ✅ Japanese text, warns about irreversibility
