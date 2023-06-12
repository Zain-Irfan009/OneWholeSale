$(document).on("keyup", ".option_value", function () {
  make_variants();
});
function make_variants() {
  var option1_array = [];
  var option2_array = [];
  var option3_array = [];
  $.each($(".option_value_append"), function (option_key, value) {
    var this_var = $(this);
    $.each(this_var.find(".option_count"), function (option_value_key, value1) {
      $.each($(this).find(".option_value"), function (key2, value2) {
        if (option_key == 0 && $(this).val() != "") {
          option1_array.push($(this).val());
        } else if (option_key == 1 && $(this).val() != "") {
          option2_array.push($(this).val());
        } else if (option_key == 2 && $(this).val() != "") {
          option3_array.push($(this).val());
        }
      });
    });
    $.each(
      this_var.find(".option_value_delete_div"),
      function (option_value_key, value3) {
        $.each($(this).find(".option_value"), function (key4, value4) {
          if (option_key == 0 && $(this).val() != "") {
            option1_array.push($(this).val());
          } else if (option_key == 1 && $(this).val() != "") {
            option2_array.push($(this).val());
          } else if (option_key == 2 && $(this).val() != "") {
            option3_array.push($(this).val());
          }
        });
      }
    );
  });
  // console.log(option1_array, option2_array,option3_array)
  $(".variant-tbody").html("");
  $.each(option1_array, function (key1, option_value) {
    console.log(option_value);
    if (option_value != "") {
      var title = option_value;
      if (option2_array.length !== 0 && option3_array.length === 0) {
        $.each(option2_array, function (key2, option_value2) {
          var title = option_value + "/" + option_value2;
          console.log("2 variant:", title);
          $(".variant-tbody").append(`
                        <tr>
                            <td>
                                ${title}
                                <input hidden value="${title}" name="variant_title[]">
                            </td>
                            <td>
                                <div>
                                    <input type="text" placeholder="" name="variant_price[]" class="form-control max-w-100">
                                </div>
                            </td>
                            <td>
                                <div>
                                    <input type="text" placeholder="" name="variant_cost[]" class="form-control max-w-100">
                                </div>
                            </td>
                            <td>
                                <div class="input-step">
                                    <input type="number" name="variant_quantity[]" class="product-quantity" min="0"
                                            >
                                </div>
                            </td>
                            <td>
                                <div>
                                    <input type="text" name="variant_sku[]" placeholder="" class="form-control max-w-100">
                                </div>
                            </td>
                            <td>
                                <div>
                                    <input type="text" name="variant_barcode[]"  class="form-control max-w-100">
                                </div>
                            </td>
                            <td>
                                <div>
                                    <input type="text" name="variant_weight[]"  class="form-control max-w-100">
                                </div>
                            </td>
                        </tr>
                    `);
        });
      } else if (option2_array.length !== 0 && option3_array.length !== 0) {
        $.each(option2_array, function (key2, option_value2) {
          $.each(option3_array, function (key3, option_value3) {
            var title =
              option_value + "/" + option_value2 + "/" + option_value3;
            $(".variant-tbody").append(`
                        <tr>
                            <td>
                                ${title}
                                <input hidden value="${title}" name="variant_title[]">
                            </td>
                            <td>
                                <div>
                                    <input type="text" placeholder="" name="variant_price[]" class="form-control max-w-100">
                                </div>
                            </td>
                            <td>
                                <div>
                                    <input type="text" placeholder="" name="variant_cost[]" class="form-control max-w-100">
                                </div>
                            </td>
                            <td>
                                <div class="input-step">
                                    <input type="number" name="variant_quantity[]" class="product-quantity" min="0"
                                            >
                                </div>
                            </td>
                            <td>
                                <div>
                                    <input type="text" name="variant_sku[]" placeholder="" class="form-control max-w-100">
                                </div>
                            </td>
                            <td>
                                <div>
                                    <input type="text" name="variant_barcode[]"  class="form-control max-w-100">
                                </div>
                            </td>
                            <td>
                                <div>
                                    <input type="text" name="variant_weight[]"  class="form-control max-w-100">
                                </div>
                            </td>
                        </tr>
                    `);
            console.log("3 variant:", title);
          });
        });
      } else {
        console.log("1 variant:", title);
        $(".variant-tbody").append(`
                        <tr>
                            <td>
                                ${title}
                                <input hidden value="${title}" name="variant_title[]">
                            </td>
                            <td>
                                <div>
                                    <input type="text" placeholder="" name="variant_price[]" class="form-control max-w-100">
                                </div>
                            </td>
                            <td>
                                <div>
                                    <input type="text" placeholder="" name="variant_cost[]" class="form-control max-w-100">
                                </div>
                            </td>
                            <td>
                                <div class="input-step">
                                    <input type="number" name="variant_quantity[]" class="product-quantity" min="0"
                                            >
                                </div>
                            </td>
                            <td>
                                <div>
                                    <input type="text" name="variant_sku[]" placeholder="" class="form-control max-w-100">
                                </div>
                            </td>
                            <td>
                                <div>
                                    <input type="text" name="variant_barcode[]"  class="form-control max-w-100">
                                </div>
                            </td>
                            <td>
                                <div>
                                    <input type="text" name="variant_weight[]"  class="form-control max-w-100">
                                </div>
                            </td>
                        </tr>
                    `);
      }
    }
  });
}

    /* -----------------------------------------------------------------------------------------


    -------------------------------------------------------adding option code ends 


    ------------------------------------------------------------------------------------------*/
