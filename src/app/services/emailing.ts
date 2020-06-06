export class EmailBody {

    getStatusEmailBody(order_id:string, name:string, status:string, note:string){
        return `
        <table style="width:600px;border:17px solid #fbfcfc;margin-left:auto;margin-right:auto" bgcolor="#FBFCFC">
        <tbody>
            <tr>
                <td style="width:600px" bgcolor="#FBFCFC"><a
                        href="https://tacgifts.com" target="_blank"
                        data-saferedirecturl="https://www.google.com/url?q=https://tacgifts.com&amp;source=gmail&amp;ust=1563620188133000&amp;usg=AFQjCNEsj0bDx87ecBxnVCfRfINEXLCDXA"><img
                            style="display:block;margin-left:auto;margin-right:auto"
                            src="https://firebasestorage.googleapis.com/v0/b/taconlinegiftshop.appspot.com/o/logos%2Ftac_logo.png?alt=media&token=a760ac9c-ffce-4aa7-a578-ca7ff24132eb"
                            alt="TAC" width="210" class="CToWUd"></a></td>
            </tr>
            <tr>
                <td style="width:600px" bgcolor="#dc457e" height="5px"></td>
            </tr>
    
    
            <tr>
                <td style="width:600px" bgcolor="#FBFCFC"><a
                        href="https://tacgifts.com"
                        target="_blank"
                        data-saferedirecturl="https://www.google.com/url?q=https://tacgifts.com&amp;source=gmail&amp;ust=1563620188133000&amp;usg=AFQjCNHnHpiDVxR2cIm7BJ4DfpaLTT9tkw"><img
                            style="display:block;margin-left:auto;margin-right:auto" width="600"
                            src="https://firebasestorage.googleapis.com/v0/b/taconlinegiftshop.appspot.com/o/promo%20images%2F_MG_2295e.jpg?alt=media&token=0007eca1-a469-47ce-b0ef-9deab2e19266"
                            alt="Confirmed order" class="CToWUd"></a></td>
            </tr>
    
    
    
            <tr>
                <td align="center" valign="top"
                    style="font-size:24px;font-family:'Open Sans',Arial,Helvetica,sans-serif;color:#1c2c3a">Order ID <span
                        style="color:#dc457e">${order_id}</span></td>
            </tr>
    
    
    
    
    
    
            <tr>
                <td align="left" valign="top">
                    <font style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#212121;line-height:20px">
                        <br> Hi ${name},<br><br>
                        Thanks for ordering with TAC.<br>
                        ${note}<br></font>
                </td>
            </tr>
    
            <tr>
                <td height="20" valign="top"></td>
            </tr>
    
            <tr>
                <td align="center" style="padding:10px;border:2px dashed #999999">
                    <strong>
                        <font style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#353535">
    
    
    
                            Order Current Status:
    
                        </font>
                        <font style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#eb603b">${status}</font>
                    </strong>
                </td>
            </tr>
    
            <tr>
                <td height="20" valign="top"></td>
            </tr>
    
            <tr>
                <td align="left" valign="top">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                        <tbody>
                            <tr>
                                <td colspan="2">&nbsp;</td>
                            </tr>
                            <tr>
                                <td colspan="2" align="left"
                                    style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#212121">
    
    
    
                                    If you have any questions about your order, don't hesitate to call us at +234
                                    814 2630 028<br><br>
    
                                </td>
                            </tr>
    
    
                            <tr>
                                <td style="width:600px" bgcolor="#dc457e" height="2.5px" colspan="3"></td>
                            </tr>
                            <tr>
                                <td colspan="2">
    
                                    <a href="https://tacgifts.com"
                                        target="_blank"
                                        data-saferedirecturl="https://www.google.com/url?q=https://tacgifts.com&amp;source=gmail&amp;ust=1563620188133000&amp;usg=AFQjCNFfHCzFxLGZ37H8tfUTGv6REOwa7Q"><img
                                            width="600px"
                                            src="https://firebasestorage.googleapis.com/v0/b/taconlinegiftshop.appspot.com/o/promo%20images%2F_MG_2295e.jpg?alt=media&token=0007eca1-a469-47ce-b0ef-9deab2e19266"
                                            class="CToWUd"></a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
    
        </tbody>
    </table>
        `
    }

    getInvoiceBody(date: string, billing_name: string, currency_total_amount: string, trans_id: string, shipping_details: string, currency_shipping_fee: string, currency_tax_fee: string, cart_items: string, track_id:string): string {
        return `
        <table id="getbody" cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" bgcolor="#eeeeee"
    style="border-collapse:collapse">
    <tbody>
        <tr>
            <td valign="top">
                <center style="width:100%">
                    <div style="max-width:600px">

                        <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#eeeeee" width="100%"
                            style="max-width:600px">
                            <tbody>
                                <tr>
                                    <td style="font-family:arial;font-size:12px;color:#333333;padding:10px 20px;text-align:center"
                                        class="m_-7433457280851606022dn-reply-note">
                                        <strong>TRACKING ID: ${track_id}</strong>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table
                            style="margin-left:0;border-collapse:collapse;background-color:#ffffff;width:100%;max-width:600px"
                            cellspacing="0" cellpadding="0" border="0">
                            <tbody>
                                <tr>
                                    <td style="background-color:#ffffff">

                                        <table cellspacing="0" cellpadding="0" border="0" align="center"
                                            bgcolor="#ffffff" width="100%"
                                            style="max-width:600px;border-bottom:1px solid #cccccc">
                                            <tbody>
                                                <tr>
                                                    <td style="padding:20px;text-align:right">
                                                        <a href="https://www.tacgifts.com"
                                                            class="m_-7433457280851606022header-a-company-logo"
                                                            style="text-decoration:none!important;text-decoration:none"
                                                            target="_blank"
                                                            data-saferedirecturl="https://www.google.com/url?q=http://www.tacgifts.com&amp;source=gmail&amp;ust=1562683897626000&amp;usg=AFQjCNGK-hpAHc_rnmWUspALhLBnV3-MSQ">
                                                            <img src="https://firebasestorage.googleapis.com/v0/b/taconlinegiftshop.appspot.com/o/logos%2Ftac_logo.png?alt=media&token=a760ac9c-ffce-4aa7-a578-ca7ff24132eb"
                                                                alt="logo-img" border="0"
                                                                class="m_-7433457280851606022header-avangate-logo-img CToWUd"
                                                                style="width:115px" width="115"
                                                                data-image-whitelisted="">
                                                        </a>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <table cellspacing="0" cellpadding="0" border="0" style="width:100%">
                                            <tbody>
                                                <tr>
                                                    <td style="padding:20px">

                                                        <table cellspacing="0" cellpadding="0" border="0" align="center"
                                                            bgcolor="#ffffff" width="100%" style="max-width:600px">

                                                            <tbody>
                                                                <tr>
                                                                    <td
                                                                        style="padding:20px 20px 15px;font-family:arial;font-size:12px;line-height:20px;color:#333333">
                                                                        Dear ${billing_name},
                                                                    </td>
                                                                </tr>
                                                                <tr style="border-bottom:10px solid #eeeeee">
                                                                    <td
                                                                        style="padding:0 20px 20px;font-family:arial;font-size:12px;line-height:20px;color:#333333;border-bottom:10px solid #eeeeee">
                                                                        Thank you for your order on ${date} from <a
                                                                            href="http://www.tacgifts.com"
                                                                            style="text-decoration:none!important;text-decoration:none;color:#0064c8"
                                                                            target="_blank"
                                                                            data-saferedirecturl="https://www.google.com/url?q=http://www.tacgifts.com&amp;source=gmail&amp;ust=1562683897626000&amp;usg=AFQjCNGyCOBflVmoMCUO6mDaZXtxslNTxA">https://www.<span
                                                                                class="il">tac</span><span
                                                                                class="il">gifts</span>.com</a>!
                                                                        We received your <strong>     ${currency_total_amount}</strong>
                                                                        payment for order
                                                                        <strong>${trans_id}</strong>.
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td style="padding:20px 20px 0px;font-family:arial;font-size:18px;line-height:20px;color:#333333"
                                                                        class="m_-7433457280851606022headline m_-7433457280851606022support-info-headline">
                                                                        Payment/Order information
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style="padding:20px;font-family:arial;font-size:12px;line-height:20px;color:#333333">
                                                                        <strong>Shipping Information</strong><br>
                                                                        ${shipping_details}
                                                                        <table cellspacing="0" cellpadding="0"
                                                                            border="0" align="left"
                                                                            style="Margin:auto;font-family:arial;font-size:12px"
                                                                            width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="left" width="50%"
                                                                                        class="m_-7433457280851606022ordered-item-label-td"
                                                                                        style="padding-top:20px;padding-bottom:5px;font-family:arial;font-size:12px;color:#3c3c3c;text-align:left">
                                                                                        <strong>Ordered item(s)</strong>
                                                                                    </td>
                                                                                    <td align="right" width="25%"
                                                                                        class="m_-7433457280851606022ordered-item-unit-price-td"
                                                                                        style="padding-top:20px;padding-bottom:5px;font-family:arial;font-size:12px;color:#333333;text-align:right">
                                                                                        <strong>Unit Price</strong>
                                                                                    </td>
                                                                                    <td align="right" width="25%"
                                                                                        class="m_-7433457280851606022ordered-item-cost-td"
                                                                                        style="padding-top:20px;padding-bottom:5px;font-family:arial;font-size:12px;color:#333333;text-align:right">
                                                                                        <strong>Total</strong>
                                                                                    </td>
                                                                                </tr>
                                                                                ${cart_items}
                                                                                <tr style="line-height:1.3">
                                                                                    <td align="right" width="50%"
                                                                                        class="m_-7433457280851606022discount-label"
                                                                                        colspan="2"
                                                                                        style="padding-top:10px;font-family:arial;font-size:12px;color:#333333;text-align:right">
                                                                                        Shipping Fee
                                                                                    </td>
                                                                                    <td align="right" width="50%"
                                                                                        class="m_-7433457280851606022discount-total"
                                                                                        style="padding-top:10px;font-family:arial;font-size:12px;color:#333333;text-align:right">
                                                                                        ${currency_shipping_fee}
                                                                                    </td>
                                                                                </tr>
                                                                                <tr
                                                                                    style="line-height:1.3;font-family:arial;font-size:12px;color:#333333">
                                                                                    <td align="right" width="50%"
                                                                                        class="m_-7433457280851606022taxes-label"
                                                                                        colspan="2"
                                                                                        style="padding-top:10px;font-family:arial;font-size:12px;color:#333333;text-align:right">
                                                                                        Sales Tax / VAT
                                                                                    </td>
                                                                                    <td align="right" width="50%"
                                                                                        class="m_-7433457280851606022taxes-total"
                                                                                        colspan="2"
                                                                                        style="padding-top:10px;font-family:arial;font-size:12px;color:#333333;text-align:right">
                                                                                        ${currency_tax_fee}
                                                                                    </td>
                                                                                </tr>
                                                                                <tr
                                                                                    style="line-height:1.3;font-family:arial;font-size:12px;color:#333333">
                                                                                    <td align="right" width="50%"
                                                                                        class="m_-7433457280851606022taxes-label"
                                                                                        colspan="2"
                                                                                        style="padding-top:10px;padding-bottom:10px;font-family:arial;font-size:12px;color:#333333;text-align:right;border-bottom:1px solid #cccccc">
                                                                                        <strong>Grand Total</strong>
                                                                                    </td>
                                                                                    <td align="right" width="50%"
                                                                                        class="m_-7433457280851606022order-total"
                                                                                        style="padding-top:10px;padding-bottom:10px;border-bottom:1px solid #cccccc;font-family:arial;font-size:12px;color:#333333;text-align:right">
                                                                                        <strong>${currency_total_amount}</strong>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>

                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td style="padding:0 20px 15px;font-family:arial;font-size:12px;line-height:20px;color:#333333;border-bottom:10px solid #eeeeee"
                                                                        class="m_-7433457280851606022terms-and-conditions">
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td style="padding:20px 20px 0px;font-family:arial;font-size:18px;line-height:20px;color:#333333"
                                                                        class="m_-7433457280851606022headline m_-7433457280851606022support-info-headline">
                                                                        Support information
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td style="padding:15px 20px 20px;font-family:arial;font-size:12px;line-height:20px;color:#333333;border-bottom:10px solid #eeeeee"
                                                                        class="m_-7433457280851606022tech-suport-section">
                                                                        <strong>Need support?</strong> For
                                                                        product shipping, payment and other
                                                                        technical support issues, please contact <span
                                                                            class="il">TAC</span> on
                                                                            +234 706 711 7723 or <a
                                                                            href="mailto:support@tacgifts.com"
                                                                            style="text-decoration:none!important;text-decoration:none;color:#0064c8"
                                                                            target="_blank">support@<span
                                                                                class="il">tacgifts</span><span
                                                                                class="il"></span>.com</a> <br>
                                                                    </td>
                                                                </tr>


                                                                <tr>
                                                                    <td style="padding:15px 20px 15px;font-family:arial;font-size:12px;line-height:20px;color:#333333;border-bottom:10px solid #eeeeee"
                                                                        class="m_-7433457280851606022footer m_-7433457280851606022signature">
                                                                        TAC has processed your order.
                                                                        <br>
                                                                        <br> Thank you,
                                                                        <br>
                                                                        <strong>The TAC Team</strong>
                                                                        <br>
                                                                        <a href="http://www.tacgifts.com"
                                                                            style="text-decoration:none!important;text-decoration:none;color:#0064c8"
                                                                            target="_blank"
                                                                            data-saferedirecturl="https://www.google.com/url?q=http://www.tacgifts.com&amp;source=gmail&amp;ust=1562683897626000&amp;usg=AFQjCNGK-hpAHc_rnmWUspALhLBnV3-MSQ">www.tacgifts.com</a>
                                                                    </td>
                                                                </tr>

                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>


                    </div>
                </center>
            </td>
        </tr>
    </tbody>
</table>
        `
    }
}