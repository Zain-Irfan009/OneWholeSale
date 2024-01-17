<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\Mailer\Transport\Smtp\SmtpTransport;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mailer\Transport\Smtp\Stream\AbstractStream;
use Symfony\Component\Mailer\Transport\Smtp\Stream\Stream;

class SendMail extends Mailable
{
    use Queueable, SerializesModels;

    public $details;
    public $emailSettings;
    public $type;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($details,$emailSettings,$type)
    {

        $this->details = $details;
        $this->emailSettings = $emailSettings;
        $this->type = $type;
    }

    /**
     * Get the message envelope.
     *
     * @return \Illuminate\Mail\Mailables\Envelope
     */
    public function envelope()
    {

        if($this->type=='Seller Message'){
            return new Envelope(
                subject: 'OneWholesale',
            );
        } else if($this->type=='Seller Status'){
            return new Envelope(
                subject: 'OneWholesale',
            );
        }

        else if($this->type=='Order Message'){
            return new Envelope(
                subject: 'OneWholesale',
            );
        }
        else if($this->type=='Order Cancel'){
            return new Envelope(
                subject: 'OneWholesale',
            );
        }

        else if($this->type=='Announcement Message'){
            return new Envelope(
                subject: $this->details['title'],
            );
        }

        else if($this->type=='Set New Password'){
            return new Envelope(
                subject: 'Set New Password',
            );
        }

        else if($this->type=='Shipment'){
            return new Envelope(
                subject: 'Shipment Attachment',
            );
        }

        else {
            return new Envelope(
                subject: 'Product Approved',
            );
        }

    }



    /**
     * Get the message content definition.
     *
     * @return \Illuminate\Mail\Mailables\Content
     */
    public function content()
    {
            if($this->type=='Seller Message'){
                return new Content(
                    view: 'email.send_message',
                );
            }
            else if($this->type=='Seller Status'){

                return new Content(
                    view: 'email.seller_status',
                );
            }

            else if($this->type=='Order Message'){

                return new Content(
                    view: 'email.order_message3',
                );
            }
            else if($this->type=='Order Cancel'){

                return new Content(
                    view: 'email.order_cancel_message',
                );
            }
            else if($this->type=='Announcement Message'){

                return new Content(
                    view: 'email.announcement_message',
                );
            }
            else if($this->type=='Set New Password'){
                return new Content(
                    view: 'email.set_password',
                );

            }
            else if($this->type=='Shipment'){
                return new Content(
                    view: 'email.shipment_file',
                );

            }
            else {
                return new Content(
                    view: 'email.send_mail',
                );
            }
    }

    /**
     * Get the attachments for the message.
     *
     * @return array
     */
    public function attachments()
    {
        if (isset($this->details['attachment'])) {
            // Assuming $this->details['attachment'] contains the path to the attachment file
            $attachmentPath = $this->details['attachment'];

            return [
                $attachmentPath,
            ];
        }

        return [];
    }
}
