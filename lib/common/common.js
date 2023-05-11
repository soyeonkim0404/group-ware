export default function numberUnit(ele) {
  return (ele || '').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
