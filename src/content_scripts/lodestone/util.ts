//
// Show alert
//
export function failAlert(what: string): void {
  alert(
    '[Nunze]' +
      what +
      'に失敗しました。\n' +
      'ページを更新して再度試してみてください。'
  );
}
