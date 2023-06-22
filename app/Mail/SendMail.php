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
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($details,$emailSettings)
    {

        $this->details = $details;
        $this->emailSettings = $emailSettings;
    }

    /**
     * Get the message envelope.
     *
     * @return \Illuminate\Mail\Mailables\Envelope
     */
    public function envelope()
    {
        return new Envelope(
            subject: 'Product Approved',
        );
    }

    /**
     * Get the message content definition.
     *
     * @return \Illuminate\Mail\Mailables\Content
     */
    public function content()
    {

//        $smtpHost = $this->emailSettings->smtp_host;
//        $smtpPort = $this->emailSettings->smtp_port;
//        $smtpUsername = $this->emailSettings->smtp_username;
//        $smtpPassword = $this->emailSettings->smtp_password;
//
//        $stream = new  Symfony\Component\Mailer\Transport\Smtp\Stream();
//        $transport = new SmtpTransport($stream);
//        $transport->setHost($smtpHost);
//        $transport->setPort($smtpPort);
//        $transport->setUsername($smtpUsername);
//        $transport->setPassword($smtpPassword);
//
//// Configure the SMTP transport using the Mail facade
//        $mailer = new Mailer($transport);
//dd($mailer);

        return new Content(
            view: 'email.send_mail',
        );

    }

    /**
     * Get the attachments for the message.
     *
     * @return array
     */
    public function attachments()
    {
        return [];
    }
}
